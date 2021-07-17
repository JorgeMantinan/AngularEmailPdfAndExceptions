import { Postalcode } from './postalcode';
import { UserDataExtended } from 'src/app/Model/userDataExtended';

// dtg005-DCS-26/11/2019
export class Address {
  id: number;
  addressName: string;
  streetType: number;
  portal: number;
  floor: string;
  postalCode: Postalcode;
  userdataextended: UserDataExtended;
  door: string;
}
