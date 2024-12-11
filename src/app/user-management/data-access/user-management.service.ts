import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakService } from "keycloak-angular";
import { catchError, combineLatest, EMPTY, from, startWith, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { CreateUser, User } from "../interfaces/user";
import { environment } from "../../../environments/environment.development";
import { Pagination } from "../../shared/interfaces/pagination";

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

@Injectable()
export class UserManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  readonly #state = signal<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      pageSize: 5,
    }
  });

  users = computed(() => this.#state().users);
  loading = computed(() => this.#state().loading);
  //TODO: snackbar for errors
  error = computed(() => this.#state().error);
  pagination = computed(() => this.#state().pagination);

  private readonly userCount$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        this.userCount(token)
      ),
    );

  loadUsers$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        this.getUsers(token)
      ),
      tap((users) => {
        this.#state.update((state) => ({
          ...state,
          users,
          loading: false,
        }));
      }),
    );

    createUser$ = new Subject<CreateUser>();
    private readonly userCreated$ = this.createUser$
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.#state.update((state) => ({
            ...state,
            loading: true,
          }));
        }),
        switchMap((user) =>
          from(this.keycloakService.getToken()).pipe(
            withLatestFrom([user]),
            switchMap(([token, user]) => this.createUser(token, user)),
            switchMap(() => this.loadUsers$),
            catchError((error) => {
              this.#state.update((state) => ({
                ...state,
                error: error.message,
                loading: false,
              }));
              return EMPTY;
            })
          )
        )
      );

    deleteUser$ = new Subject<string>();
    private readonly userDeleted$ = this.deleteUser$
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.#state.update((state) => ({
            ...state,
            loading: true,
          }));
        }),
        switchMap((userId) =>
          from(this.keycloakService.getToken()).pipe(
            withLatestFrom([userId]),
            switchMap(([token, userId]) => this.deleteUser(token, userId)),
            switchMap(() => this.loadUsers$),
            catchError((error) => {
              this.#state.update((state) => ({
                ...state,
                error: error.message,
                loading: false,
              }));
              return EMPTY;
            })
          )
        )
      );

    constructor() {
      this.userCount$.subscribe((total) => {
        this.#state.update((state) => ({
          ...state,
          pagination: {
            ...state.pagination,
            total,
          },
        }));
      });

      this.loadUsers$.subscribe();

      this.userCreated$.subscribe();

      this.userDeleted$.subscribe();
    }

  private getUsers(token: string) {
    const first = (this.pagination().page - 1) * this.pagination().pageSize;
    const max = this.pagination().page * this.pagination().pageSize;
    return this.http.get<User[]>(`${environment.keycloakConfig.userManagementBaseUrl}?first=${first}&max=${max}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  private createUser(token: string, user: CreateUser) {
    return this.http.post(
      `${environment.keycloakConfig.userManagementBaseUrl}`,
      user,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private deleteUser(token: string, userId: string) {
    return this.http.delete(
      `${environment.keycloakConfig.userManagementBaseUrl}/${userId}`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private userCount(token: string) {
    return this.http.get<number>(
      `${environment.keycloakConfig.userManagementBaseUrl}/count`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}