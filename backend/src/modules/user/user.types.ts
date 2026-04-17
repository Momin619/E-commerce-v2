export type Role = "seller" | "customer";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface IJwtUser {
  id: string;
  role: Role;
}
