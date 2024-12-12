import { Component, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-role-table-toolbar",
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatTooltipModule],
  template: `
    <mat-toolbar>
      <span class="spacer"></span>
      <button
        mat-icon-button
        (click)="create.emit()"
        matTooltip="Create role"
        matTooltipPosition="above"
      >
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class RoleTableToolbarComponent {
  create = output<void>();
}