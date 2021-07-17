import { Community } from './community';
import { Township } from './township';

// dtg005-DCS-26/11/2019
export class Province {
  cod: number;
  name: string;
  community: Community;
  township: Township;
}
