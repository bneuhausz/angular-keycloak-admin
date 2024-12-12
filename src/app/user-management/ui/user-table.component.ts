import { Component, input, output } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from "../interfaces/user";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Pagination, PartialPaginationWithoutTotal } from "../../shared/interfaces/pagination";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-user-table",
  imports: [MatTableModule, MatProgressSpinnerModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatTooltipModule],
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
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let user">
            <button
              mat-mini-fab class="action-button"
              (click)="manageGroups.emit(user.id)"
              matTooltip="Manage groups"
              matTooltipPosition="above"
            >
              <mat-icon>group_add</mat-icon>
            </button>
            <button
              mat-mini-fab class="action-button"
              (click)="resetPassword.emit(user.id)"
              matTooltip="Reset password"
              matTooltipPosition="above"
            >
              <mat-icon>lock_reset</mat-icon>
            </button>
            <button
              mat-mini-fab class="delete-button action-button"
              (click)="deleteUser.emit(user.id)"
              matTooltip="Delete user"
              matTooltipPosition="above"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns" id="user-table-header"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSize]="pagination().pageSize" [pageSizeOptions]="[3, 5, 10]"
        [length]="pagination().total" [pageIndex]="pagination().pageIndex" (page)="pageEvent($event)">
      </mat-paginator>
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

      .mat-column-id {
        width: 350px;
      }

      .mat-column-enabled {
        width: 100px;
      }

      .mat-column-actions {
        width: 190px;
        text-align: center;
      }

      .delete-button {
        background-color: var(--mat-sys-error);
        color: var(--mat-sys-on-error);
      }

      .action-button {
        margin: 0 5px;
      }
    `,
  ],
})
export class UserTableComponent {
  users = input.required<User[]>();
  loading = input.required<boolean>();
  pagination = input.required<Pagination>();
  deleteUser = output<string>();
  resetPassword = output<string>();
  manageGroups = output<string>();
  pageChange = output<PartialPaginationWithoutTotal>();

  displayedColumns = ['id', 'username', 'enabled', 'actions'];

  pageEvent(event: PageEvent) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}