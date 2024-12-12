import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KeycloakService } from "keycloak-angular";
import { from, map, switchMap } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Role } from "../interfaces/role";

export const DEFAULT_ROLES = ['default-roles', 'offline_access', 'uma_authorization', 'default-roles-master'];

@Injectable({
  providedIn: 'root',
})
export class RealmRoleUtils {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);

  loadRealmRoles$ = from(this.keycloakService.getToken())
    .pipe(
      takeUntilDestroyed(),
      switchMap(token => this.getRealmRoles(token)),
      map(roles => roles.filter(role => !DEFAULT_ROLES.some(defaultRole => role.name.toLowerCase().includes(defaultRole.toLowerCase())))),
    );

  private getRealmRoles(token: string) {
    return this.http.get<Role[]>(
      `${environment.keycloakConfig.roleManagementBaseUrl}`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }
}