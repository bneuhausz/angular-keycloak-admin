import { computed, inject, Injectable, signal } from "@angular/core";
import { Role } from "../../shared/interfaces/role";
import { KeycloakService } from "keycloak-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RealmRoleUtils } from "../../shared/utils/realm-role-utils";
import { catchError, EMPTY, from, map, Subject, switchMap, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";

interface RoleManagementState {
  realmRoles: Role[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class RoleManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  private readonly realmRoleUtils = inject(RealmRoleUtils);

  readonly #state = signal<RoleManagementState>({
    realmRoles: [],
    loading: true,
    error: null,
  });

  realmRoles = computed(() => this.#state().realmRoles);
  loading = computed(() => this.#state().loading);

  createRole$ = new Subject<string>();
  private readonly roleCreated$ = this.createRole$
    .pipe(
      switchMap(roleName =>
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.createRole(token, roleName)),
          switchMap(() => this.loadRealmRoles$),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          }),
        )
      )
    );

  deleteRole$ = new Subject<string>();
  private readonly roleDeleted$ = this.deleteRole$
    .pipe(
      switchMap(roleName =>
        from(this.keycloakService.getToken()).pipe(
          switchMap(token => this.deleteRole(token, roleName)),
          switchMap(() => this.loadRealmRoles$),
          catchError((error) => {
            this.#state.update(state => ({
              ...state,
              error: error.message,
              loading: false
            }));
            return EMPTY;
          }),
        )
      )
    );

  private readonly loadRealmRoles$ = this.realmRoleUtils.loadRealmRoles$
    .pipe(
      map(realmRoles => realmRoles.filter(role => !role.composite)),
      tap((realmRoles) =>
        this.#state.update(state => ({
          ...state,
          realmRoles,
          loading: false
        }))
      ),
      catchError((error) => {
        this.#state.update(state => ({
          ...state,
          error: error.message,
          loading: false
        }));
        return EMPTY;
      }),
    );

  constructor() {
    this.loadRealmRoles$.subscribe();
    this.roleCreated$.subscribe();
    this.roleDeleted$.subscribe();
  }

  private createRole(token: string, roleName: string) {
    console.log(roleName);
    return this.http.post(
      `${environment.keycloakConfig.roleManagementBaseUrl}`,
      { name: roleName },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  private deleteRole(token: string, roleName: string) {
    return this.http.delete(
      `${environment.keycloakConfig.roleManagementBaseUrl}/${roleName}`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}