import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  headers?: HttpHeaders;

  async login() {
    if (!this.keycloakService.isLoggedIn()) {
      await this.keycloakService.login();
    }
  }

  logout() {
    this.keycloakService.logout('http://localhost:4200');
  }

  async getToken() {
    const token = await this.keycloakService.getToken();
    this.setHeaders(token);
  }

  getUsers() {
    return this.http.get(`http://localhost:8069/admin/realms/myrealm/users`, { headers: this.headers });
  }

  private setHeaders(token: string) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}