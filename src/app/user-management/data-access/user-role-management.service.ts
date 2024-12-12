import { computed, inject, Injectable, signal } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { catchError, EMPTY, from, map, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EditUserRole, Role } from "../../shared/interfaces/role";
import { DEFAULT_ROLES, RealmRoleUtils } from "../../shared/utils/realm-role-utils";

interface RoleManagementState {
  realmRoles: Role[];
  userRoles: Role[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class UserRoleManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  private readonly realmRoleUtils = inject(RealmRoleUtils);

  readonly #state = signal<RoleManagementState>({
    realmRoles: [],
    userRoles: [],
    loading: true,
    error: null,
  });

  realmRoles = computed(() => this.#state().realmRoles);
  userRoles = computed(() => this.#state().userRoles);

  private readonly loadRealmRoles$ = this.realmRoleUtils.loadRealmRoles$
    .pipe(
      catchError((error) => {
        this.#state.update(state => ({
          ...state,
          error: error.message,
          loading: false
        }));
        return EMPTY;
      }),
    );

  userSelected$ = new Subject<string>();
  private readonly loadUserRoles$ = this.userSelected$
    .pipe(
      switchMap(userId => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.getUserRoles(token, userId)),
          map(roles => roles.filter(role => 
            !DEFAULT_ROLES.some(defaultRole => 
              role.name.toLowerCase().includes(defaultRole.toLowerCase())
            )
          )),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  addUserRole$ = new Subject<EditUserRole>();
  private readonly userRoleAdded$ = this.addUserRole$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.#state.update(state => ({ ...state, loading: true }))),
      switchMap(({ userId, roleId, roleName }) => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.addUserRole(token, userId, roleId, roleName)),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  deleteUserRole$ = new Subject<EditUserRole>();
  private readonly userRoleDeleted$ = this.deleteUserRole$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.#state.update(state => ({ ...state, loading: true }))),
      switchMap(({ userId, roleId, roleName }) => 
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.deleteUserRole(token, userId, roleId, roleName)),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          })
        )
      )
    );

  constructor() {
    this.loadRealmRoles$.subscribe(realmRoles => {
      this.#state.update(state => ({
        ...state,
        realmRoles,
        loading: false
      }));
    });

    this.loadUserRoles$.subscribe(userRoles => {
      this.#state.update(state => ({
        ...state,
        userRoles,
        loading: false
      }));
    });

    this.userRoleAdded$.subscribe(() => {
      this.#state.update(state => ({ ...state, loading: false }));
    });

    this.userRoleDeleted$.subscribe(() => {
      this.#state.update(state => ({ ...state, loading: false }));
    });
  }

  private getUserRoles(token: string, userId: string) {
    return this.http.get<Role[]>(
      `${environment.keycloakConfig.userManagementBaseUrl}/${userId}/role-mappings/realm`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private addUserRole(token: string, userId: string, roleId: string, roleName: string) {
    return this.http.post(
      `${environment.keycloakConfig.userManagementBaseUrl}/${userId}/role-mappings/realm`,
      [{ id: roleId, name: roleName }],
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private deleteUserRole(token: string, userId: string, roleId: string, roleName: string) {
    return this.http.delete(
      `${environment.keycloakConfig.userManagementBaseUrl}/${userId}/role-mappings/realm`,
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        body: [{ id: roleId, name: roleName }],
      }
    );
  }
}