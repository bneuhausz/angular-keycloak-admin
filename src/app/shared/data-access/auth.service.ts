import { HttpClient, HttpHeaders } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Subject } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface AuthState {
  currentUser: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly http = inject(HttpClient);
  headers?: HttpHeaders;

  //state
  readonly #state = signal<AuthState>({
    currentUser: null,
  });

  //selectors
  currentUser = computed(() => this.#state().currentUser);

  //sources
  logout$ = new Subject<void>();
  login$ = new Subject<void>();

  constructor() {
    this.initializeAuthState();

    this.logout$.pipe(
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.logout();
      });

    this.login$.pipe(
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.login();
      });
  }

  private login() {
    if (!this.keycloakService.isLoggedIn()) {
      this.keycloakService.login();
    }
  }

  private logout() {
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

  private initializeAuthState() {
    if (this.keycloakService.isLoggedIn()) {
      this.#state.update((state) => ({
        ...state,
        currentUser: this.keycloakService.getUsername(),
      }));
    }
  }
}