import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RoleManagementService } from "./data-access/role-management.service";
import { RoleTableComponent } from "./ui/role-table.component";
import { RoleTableToolbarComponent } from "./ui/role-table-toolbar.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateRoleDialogComponent } from "./ui/create-role-dialog.component";
import { ConfirmDialogComponent } from "../shared/ui/confirm-dialog.component";

@Component({
  imports: [MatCardModule, RoleTableComponent, RoleTableToolbarComponent],
  providers: [RoleManagementService],
  template: `
    <main>
      <h1>Role Management</h1>
      <mat-card>
        <app-role-table-toolbar
          (create)="openCreateDialog()"
        />
        <app-role-table
          [roles]="roleManagementService.realmRoles()"
          [loading]="roleManagementService.loading()"
          (deleteRole)="openDeleteRoleDialog($event)"
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
        width: 700px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class RoleManagementComponent {
  readonly roleManagementService = inject(RoleManagementService);
  private readonly dialog = inject(MatDialog);

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateRoleDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleManagementService.createRole$.next(result.name);
      }      
    });
  }

  openDeleteRoleDialog(id: string) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.roleManagementService.deleteRole$.next(id);
        }      
      });
    }
}