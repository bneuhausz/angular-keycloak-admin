export interface User {
  id: string;
  username: string;
  enabled: boolean;
}

export type CreateUser = Omit<User, 'id'>;