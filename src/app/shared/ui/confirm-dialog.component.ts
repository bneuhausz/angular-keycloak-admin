import { Component } from "@angular/core";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  template: `
    <h2 mat-dialog-title align="center">Confirm</h2>
    <mat-dialog-content align="center">
      Are you sure you want to proceed?
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="true"
        id="delete-button"
      >
        Confirm
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 40px;
        width: 400px;
      }

      #delete-button {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }
    `
  ]
})
export class ConfirmDialogComponent {}