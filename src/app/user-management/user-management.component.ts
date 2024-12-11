import { Component, inject } from '@angular/core';
import { UserManagementService } from './data-access/user-management.service';
import { UserTableComponent } from './ui/user-table.component';
import { MatCardModule } from '@angular/material/card';
import { UserTableToolbarComponent } from './ui/user-table-toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './ui/create-user-dialog.component';
import { ConfirmDialogComponent } from '../shared/ui/confirm-dialog.component';

@Component({
  imports: [UserTableComponent, MatCardModule, UserTableToolbarComponent],
  providers: [UserManagementService],
  template: `
    <main>
      <h1>User Management</h1>
      <mat-card>
        <app-user-table-toolbar (create)="openCreateDialog()" />
        <app-user-table [users]="userManagementService.users()" [loading]="userManagementService.loading()" (delete)="deleteUser($event)" />
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
      console.log(result);
      if (result) {
        this.userManagementService.deleteUser$.next(id);
      }      
    });
  }
}