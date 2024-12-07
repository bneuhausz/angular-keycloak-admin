import { Component, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';

@Component({
  imports: [UserTableComponent],
  providers: [UserManagementService],
  template: `
    <p>User Management</p>
    <app-user-table [users]="userManagementService.users()" [loading]="userManagementService.loading()" />
  `,
})
export default class UserManagementComponent {
  userManagementService = inject(UserManagementService);
}