export interface Role {
  id: string;
  name: string;
}

export interface EditUserRole {
  userId: string;
  roleId: string;
  roleName: string;
  checked: boolean;
}