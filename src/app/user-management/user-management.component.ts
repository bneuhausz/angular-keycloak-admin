import { Component, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';
import { MatCardModule } from '@angular/material/card';
import { CreateUserFormComponent } from "./ui/create-user-form.component";

@Component({
  imports: [UserTableComponent, MatCardModule, CreateUserFormComponent],
  providers: [UserManagementService],
  template: `
    <main>
      <h1>User Management</h1>
      <mat-card>
        <!-- TODO: put this on a modal -->
        <app-create-user-form (userCreated)="userManagementService.userCreated$.next($event)" /> 
      </mat-card>
      <mat-card>
        <app-user-table [users]="userManagementService.users()" [loading]="userManagementService.loading()" />
      </mat-card>
    </main>
  `,
  styles: [
    `
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-card {
        width: 800px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class UserManagementComponent {
  userManagementService = inject(UserManagementService);
}