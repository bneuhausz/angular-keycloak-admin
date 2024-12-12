import { computed, inject, Injectable, signal } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { DEFAULT_ROLES } from "../constants/default-roles";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { catchError, EMPTY, from, map, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Role } from "../../shared/interfaces/role";

interface RoleManagementState {
  realmRoles: Role[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class UserRoleManagementService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  readonly #state = signal<RoleManagementState>({
    realmRoles: [],
    loading: true,
    error: null,
  });

  realmRoles = computed(() => this.#state().realmRoles);

  private readonly loadRealmRoles$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap(token => this.getRealmRoles(token)),
      tap((roles) => console.log(roles)),
      map(roles => roles.filter(role => !DEFAULT_ROLES.some(defaultRole => role.name.toLowerCase().includes(defaultRole.toLowerCase())))),
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
    this.loadRealmRoles$.subscribe(realmRoles => {
      this.#state.update(state => ({
        ...state,
        realmRoles,
        loading: false
      }));
    });
  }

  private getRealmRoles(token: string) {
    return this.http.get<Role[]>(
      `${environment.keycloakConfig.roleManagementBaseUrl}`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}