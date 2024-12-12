export interface Role {
  id: string;
  name: string;
  composite: boolean;
}

export interface EditUserRole {
  userId: string;
  roleId: string;
  roleName: string;
  checked: boolean;
}