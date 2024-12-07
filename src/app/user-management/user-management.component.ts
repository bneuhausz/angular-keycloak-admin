import { Component, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';

@Component({
  imports: [UserTableComponent],
  providers: [UserManagementService],
  template: `
    <main>
      <h1>User Management</h1>
      <app-user-table [users]="userManagementService.users()" [loading]="userManagementService.loading()" />
    </main>
  `,
  styles: [
    `
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export default class UserManagementComponent {
  userManagementService = inject(UserManagementService);
}