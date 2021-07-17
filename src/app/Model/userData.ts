import { Login } from './login';
import { UserDataExtended } from './userDataExtended';
import { Role } from './role';
import { Permission } from './permission';
export class UserData {
  id: number;
  dasId: string;
  name: string;
  surname1: string;
  surname2: string;
  email: string;
  state: number;
  role: Role;
  roles: Role[] = [];
  permissions: Permission[] = [];
  login: Login;
  userDataExtended: UserDataExtended;
}
