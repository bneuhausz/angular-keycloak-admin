import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakService } from "keycloak-angular";
import { catchError, EMPTY, from, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { CreateUser, User } from "../interfaces/user";

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
  
}

@Injectable()
export class UserManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  readonly #state = signal<UserManagementState>({
    users: [],
    loading: true,
    error: null,
  });

  users = computed(() => this.#state().users);
  loading = computed(() => this.#state().loading);

  loadUsers$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap((token) =>
        this.getUsers(token)
      ),
    );

    userCreated$ = new Subject<CreateUser>();

    constructor() {
      this.loadUsers$
        .subscribe((users) => {
          console.log(users);
          this.#state.update((state) => ({
            ...state,
            users,
            loading: false,
          }));
        });

      this.userCreated$
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
        )
        .subscribe((users) => {
          // TODO: actually implement user creation in KC
          this.#state.update((state) => ({
            ...state,
            users: [...users],
            loading: false,
          }));
        });
    }

  private getUsers(token: string) {
    //TODO: create environments and env variables
    return this.http.get<User[]>(`http://localhost:8069/admin/realms/myrealm/users`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  private createUser(token: string, user: CreateUser) {
    return this.http.post(
      //TODO: create environments and env variables
      `http://localhost:8069/admin/realms/myrealm/users`,
      user,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` })}
    );
  }
}