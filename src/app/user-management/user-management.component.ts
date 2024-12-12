import { Component, effect, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';
import { MatCardModule } from '@angular/material/card';
import { UserTableToolbarComponent } from './ui/user-table-toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './ui/create-user-dialog.component';
import { ConfirmDialogComponent } from '../shared/ui/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResetPasswordDialogComponent } from './ui/reset-password-dialog.component';
import { UserRoleManagementService } from './data-access/user-role-management.service';
import { ManageUserRolesDialogComponent } from './ui/manage-user-roles-dialog.component';
import { EditUserRole } from '../shared/interfaces/role';

@Component({
  imports: [UserTableComponent, MatCardModule, UserTableToolbarComponent],
  providers: [UserManagementService, UserRoleManagementService],
  template: `
    <main>
      <h1>User Management</h1>
      <mat-card>
        <app-user-table-toolbar
          [filterControl]="userManagementService.filterControl"
          (create)="openCreateDialog()"
        />
        <app-user-table
          [users]="userManagementService.users()"
          [loading]="userManagementService.loading()"
          [pagination]="userManagementService.pagination()"
          (pageChange)="userManagementService.pagination$.next($event)"
          (manageRoles)="openManageRolesDialog($event)"
          (resetPassword)="openResetPasswordDialog($event)"
          (deleteUser)="openDeleteUserDialong($event)"
        />
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
        width: 1000px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class UserManagementComponent {
  userManagementService = inject(UserManagementService);
  userRoleManagementService = inject(UserRoleManagementService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.createUser$.next(result);
      }      
    });
  }

  openManageRolesDialog(id: string) {
    this.userRoleManagementService.userSelected$.next(id);
    const user = this.userManagementService.users().find(user => user.id === id);
    const dialogRef = this.dialog.open(ManageUserRolesDialogComponent, {
      data: {
        user,
        realmRoles: this.userRoleManagementService.realmRoles(),
        userRoles: this.userRoleManagementService.userRoles
      },
    });

    dialogRef.componentInstance.roleToggled.subscribe((event: EditUserRole) => {
      if (event.checked) {
        this.userRoleManagementService.addUserRole$.next(event);
      }
      else {
        this.userRoleManagementService.deleteUserRole$.next(event);
      }
    });
  }

  openResetPasswordDialog(id: string) {
    const user = this.userManagementService.users().find(user => user.id === id);
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.resetPassword$.next({ id, data: { value: result.password } });
      }      
    });
  }

  openDeleteUserDialong(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManagementService.deleteUser$.next(id);
      }      
    });
  }

  constructor() {
    effect(() => {
      if (this.userManagementService.error()) {
        this.snackBar.open(this.userManagementService.error() as string, 'Close', {
          horizontalPosition: 'center',
          panelClass: 'error-snackbar',
        });
      }
    });
  }
}