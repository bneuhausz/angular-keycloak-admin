import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakService } from "keycloak-angular";
import { from, Subject, switchMap } from "rxjs";
import { CreateUser, User } from "../interfaces/user";

interface UserManagementState {
  users: User[];
  loading: boolean;
}

@Injectable()
export class UserManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  readonly #state = signal<UserManagementState>({
    users: [],
    loading: true,
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
          this.#state.update((state) => ({
            ...state,
            users,
            loading: false,
          }));
        });

      this.userCreated$
        .pipe(
          takeUntilDestroyed(),
        )
        .subscribe((user) => {
          // TODO: actually implement user creation in KC
          this.#state.update((state) => ({
            ...state,
            users: [...state.users, { ...user, id: Math.random().toString() }],
          }));
        });
    }

  private getUsers(token: string) {
    //TODO: create environments and env variables
    return this.http.get<User[]>(`http://localhost:8069/admin/realms/myrealm/users`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }
}