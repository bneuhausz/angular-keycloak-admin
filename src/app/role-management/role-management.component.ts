import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RoleManagementService } from "./data-access/role-management.service";
import { RoleTableComponent } from "./ui/role-table.component";

@Component({
  imports: [MatCardModule, RoleTableComponent],
  providers: [RoleManagementService],
  template: `
    <main>
      <h1>Role Management</h1>
      <mat-card>
        <app-role-table
          [roles]="roleManagementService.realmRoles()"
          [loading]="roleManagementService.loading()"
        />
      </mat-card>
    </main>
  `,
  styles: [
    `
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      mat-card {
        width: 700px;
        margin: 20px 10px;
        padding: 20px 0;
      }
    `,
  ],
})
export default class RoleManagementComponent {
  readonly roleManagementService = inject(RoleManagementService);
}