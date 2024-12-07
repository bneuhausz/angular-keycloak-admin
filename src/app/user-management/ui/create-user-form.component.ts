import { Component, inject, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CreateUser } from "../interfaces/user";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-user-form',
  imports: [ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="userCreated.emit(userForm.getRawValue())">
      <mat-form-field>
        <input matInput type="text" formControlName="username" placeholder="Username" />
      </mat-form-field>
      <mat-slide-toggle formControlName="enabled">Enabled</mat-slide-toggle>
      <button
        mat-raised-button
        [disabled]="!userForm.valid"
        class="primary-button"
        type="submit"
      >
        Create
      </button>
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
        width: 50%;
      }

      .primary-button {
        margin: 20px 0;
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        width: 20%;
      }
    `
  ]
})
export class CreateUserFormComponent {
  userCreated = output<CreateUser>();
  private readonly fb = inject(FormBuilder);

  userForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    enabled: false,
  });
}