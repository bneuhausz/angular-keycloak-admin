import { Component, input, output } from "@angular/core";
import { Role } from "../../shared/interfaces/role";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-role-table",
  imports: [MatProgressSpinnerModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    @if (loading()) {
      <section class="spinner-container">
        <mat-progress-spinner mode="indeterminate" diameter="100"></mat-progress-spinner>
      </section>
    }
    @else {
      <table mat-table [dataSource]="roles()">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let role">
            {{ role.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let role">
            {{ role.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let role">
            <button
              mat-mini-fab class="delete-button"
              matTooltip="Delete role"
              matTooltipPosition="above"
              (click)="deleteRole.emit(role.name)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns" id="role-table-header"></tr>
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

      #role-table-header {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }

      .mat-column-actions {
        width: 80px;
        text-align: center;
      }

      .delete-button {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }
    `,
  ],
})
export class RoleTableComponent {
  roles = input.required<Role[]>();
  loading = input.required<boolean>();
  deleteRole = output<string>();

  displayedColumns = ['id', 'name', 'actions'];
}