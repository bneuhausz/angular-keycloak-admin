import { Component, effect, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';
import { MatCardModule } from '@angular/material/card';
import { UserTableToolbarComponent } from './ui/user-table-toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './ui/create-user-dialog.component';
import { ConfirmDialogComponent } from '../shared/ui/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [UserTableComponent, MatCardModule, UserTableToolbarComponent],
  providers: [UserManagementService],
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
          (delete)="deleteUser($event)"
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
        width: 800px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class UserManagementComponent {
  userManagementService = inject(UserManagementService);
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

  deleteUser(id: string) {
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