import { Component, input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-create-role-form",
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="form()">
      <mat-form-field>
        <input matInput type="text" formControlName="name" placeholder="Name" />
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-form-field {
        width: 90%;
      }
    `
  ]
})
export class CreateRoleFormComponent {
  form = input.required<FormGroup>();
}