import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  host: { 'data-dialog': 'manage-user-groups' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  template: `
    <h2 mat-dialog-title align="center">Manage User Groups</h2>
    <mat-dialog-content>
      
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 300px;
        width: 550px;
      }
    `
  ]
})
export class ManageUserGroupsDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    console.log(this.data);
  }
}