import { Component, output } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: "app-user-table-toolbar",
  imports: [MatIconModule, MatButtonModule, MatToolbarModule],
  template: `
    <mat-toolbar>
      <button mat-icon-button (click)="create.emit()">
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
  `,
})
export class UserTableToolbarComponent {
  create = output<void>();
}