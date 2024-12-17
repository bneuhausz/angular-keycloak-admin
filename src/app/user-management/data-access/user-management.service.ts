import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakService } from "keycloak-angular";
import { catchError, combineLatest, debounceTime, distinctUntilChanged, EMPTY, from, startWith, Subject, switchMap, tap } from "rxjs";
import { CreateUser, ResetUserPassword, User } from "../interfaces/user";
import { environment } from "../../../environments/environment.development";
import { Pagination, PartialPaginationWithoutTotal } from "../../shared/interfaces/pagination";
import { FormControl } from "@angular/forms";
import { createCredential } from "../interfaces/credential";

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  filter: string;
  pagination: Pagination;
}

@Injectable()
export class UserManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  filterControl = new FormControl();

  readonly #state = signal<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    filter: '',
    pagination: {
      total: 0,
      pageIndex: 0,
      pageSize: 5,
    }
  });

  users = computed(() => this.#state().users);
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);
  pagination = computed(() => this.#state().pagination);

  private readonly filterChanged$ = this.filterControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap((filter) => {
        this.#state.update((state) => ({
          ...state,
          filter,
          pagination: {
            ...state.pagination,
            pageIndex: 0,
          },
        }));
      }),
      switchMap(() => this.loadUsers$)
    );

  private readonly userCount$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        this.userCount(token)
      ),
    );

  pagination$ = new Subject<PartialPaginationWithoutTotal>();
  private readonly paginated$ = this.pagination$
    .pipe(
      takeUntilDestroyed(),
      startWith(this.pagination()),
      tap((pagination) => {
        this.#state.update((state) => ({
          ...state,
          pagination: {
            total: state.pagination.total,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize
          }
        }));
      }),
      switchMap(() => this.loadUsers$),
    );

  private readonly loadUsers$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        combineLatest([
          this.getUsers(token),
          this.userCount(token)
        ])
      ),
      tap(([users, total]) => {
        this.#state.update((state) => ({
          ...state,
          users,
          pagination: {
            ...state.pagination,
            total,
          },
          loading: false,
        }));
      }),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
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
          switchMap((token) => this.createUser(token, user)),
          switchMap(() => this.loadUsers$),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
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
          switchMap((token) => this.deleteUser(token, userId)),
          switchMap(() => this.loadUsers$),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  resetPassword$ = new Subject<ResetUserPassword>();
  private readonly passwordReset$ = this.resetPassword$
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
          switchMap((token) => this.resetPassword(token, user)),
        )
      ),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          error: error.message,
          loading: false,
        }));
        return EMPTY;
      }),
    );

  constructor() {
    this.paginated$.subscribe();

    this.filterChanged$.subscribe();

    this.userCreated$.subscribe();

    this.userDeleted$.subscribe();

    this.passwordReset$.subscribe(() => {
      this.#state.update((state) => ({
        ...state,
        loading: false,
      }));
    });
  }

  private getUsers(token: string) {
    const first = (this.pagination().pageIndex) * this.pagination().pageSize;
    const max = (this.pagination().pageIndex + 1) * this.pagination().pageSize;
    const filter = this.#state().filter;
    return this.http.get<User[]>(`${environment.keycloakConfig.userManagementBaseUrl}?first=${first}&max=${max}&username=${filter}`, {
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
    const filter = this.#state().filter;
    return this.http.get<number>(
      `${environment.keycloakConfig.userManagementBaseUrl}/count?username=${filter}`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private resetPassword(token: string, user: ResetUserPassword) {
    return this.http.put(
      `${environment.keycloakConfig.userManagementBaseUrl}/${user.id}/reset-password`,
      {
        ...createCredential({ value: user.data.value }),
      },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}