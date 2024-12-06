import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/data-access/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <button (click)="authService.logout()">Logout</button>
    <button (click)="login()">Login</button>
    <button (click)="authService.getToken()">GetToken</button>
    <button (click)="getUsers()">GetUsers</button>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent{
  title = 'angular-keycloak-admin';
  authService = inject(AuthService);

  async login() {
    await this.authService.login();
    await this.authService.getToken();
  }

  getUsers() {
    this.authService.getUsers().subscribe((users) => console.log(users));
  }
}
