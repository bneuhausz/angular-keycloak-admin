import { Component, inject } from "@angular/core";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, Validators } from "@angular/forms";
import { CreateRoleFormComponent } from "./create-role-form.component";

@Component({
  host: { 'data-dialog': 'create-user' },
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, CreateRoleFormComponent],
  template: `
    <h2 mat-dialog-title align="center">Create User</h2>
    <mat-dialog-content>
      <app-create-role-form [form]="roleForm" />
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-raised-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="this.roleForm.getRawValue()"
        class="primary-button"
        [disabled]="roleForm.invalid"
        [class.disabled-button]="roleForm.invalid"
      >
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        height: 80px;
        width: 400px;
      }

      .primary-button {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .disabled-button {
        background-color: var(--mat-sys-outline-variant);
      }
    `
  ]
})
export class CreateRoleDialogComponent {
  private readonly fb = inject(FormBuilder);

  roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });
}