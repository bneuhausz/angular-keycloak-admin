import { computed, inject, Injectable, signal } from "@angular/core";
import { Role } from "../../shared/interfaces/role";
import { KeycloakService } from "keycloak-angular";
import { HttpClient } from "@angular/common/http";
import { RealmRoleUtils } from "../../shared/utils/realm-role-utils";
import { catchError, EMPTY } from "rxjs";

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

  constructor() {
    this.loadRealmRoles$.subscribe(realmRoles => {
      this.#state.update(state => ({
        ...state,
        realmRoles,
        loading: false
      }));
    });
  }
}