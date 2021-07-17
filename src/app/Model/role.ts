import { UserData } from './userData';
import { Permission } from './permission';
export class Role {
  id: number;
  name: string;
  usersData: UserData[];
  permissions: Permission[];
}
