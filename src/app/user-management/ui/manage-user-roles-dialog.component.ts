import { Component, inject, output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EditUserRole, Role } from "../../shared/interfaces/role";

//TODO: improve the design
@Component({
  host: { 'data-dialog': 'manage-user-roles' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title align="center">Manage User Roles</h2>
    <mat-dialog-content align="center">
      @for (role of data.realmRoles; track role.id) {
        <mat-checkbox [checked]="isUserInRole(role.id)" (change)="this.roleToggled.emit({ userId: this.data.user.id, roleId: role.id, roleName: role.name, checked: $event.checked })">
          {{ role.name }}
        </mat-checkbox>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 300px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `
  ]
})
export class ManageUserRolesDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  roleToggled = output<EditUserRole>();

  isUserInRole(roleId: string): boolean {
    return this.data.userRoles().some((userRole: Role) => userRole.id === roleId);
  }
}