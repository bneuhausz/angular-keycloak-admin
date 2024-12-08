import { Component, input } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from "../interfaces/user";

@Component({
  selector: "app-user-table",
  imports: [MatTableModule, MatProgressSpinnerModule, MatCheckboxModule],
  template: `
    @if (loading()) {
      <section class="spinner-container">
        <mat-progress-spinner mode="indeterminate" diameter="100"></mat-progress-spinner>
      </section>
    }
    @else {
      <table mat-table [dataSource]="users()">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let user">
            {{ user.id }}
          </td>
        </ng-container>
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>Username</th>
          <td mat-cell *matCellDef="let user">
            {{ user.username }}
          </td>
        </ng-container>
        <ng-container matColumnDef="enabled">
          <th mat-header-cell *matHeaderCellDef>Enabled</th>
          <td mat-cell *matCellDef="let user">
            <mat-checkbox [checked]="user.enabled" disabled>
            </mat-checkbox>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns" id="user-table-header"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    }
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        justify-content: center;
      }

      table {
        width: 100%;
      }

      #user-table-header {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }
    `,
  ],
})
export class UserTableComponent {
  users = input.required<User[]>();
  loading = input.required<boolean>();

  displayedColumns = ['id', 'username', 'enabled'];
}