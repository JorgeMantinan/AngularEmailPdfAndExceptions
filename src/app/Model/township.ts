import { Province } from './province';
import { Postalcode } from './postalcode';

// dtg005-DCS-26/11/2019
export class Township {
  cod: number;
  name: string;
  province: Province;
  postalcode: Postalcode;
}
