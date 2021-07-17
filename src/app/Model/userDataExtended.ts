import { UserData } from './userData';
import { Address } from './address';
import { Specialconditions } from './specialconditions';
import { HasPayrollToShow } from './hasPayrollToShow';

export class UserDataExtended {
    id: number;  // identificador en BD del usuario.
    // Tipo de documento de identidad. 1. NIF; 2. NIE y 3. Pasaporte.
    identityCardType: number;
    identityCard: string;
    // FGS 12/12/19 Ahora NIF, NIE y pasaporte van en 3 campos distintos.
    nif: string;
    nie: string;
    passport: string;
    ssNumber: string;
    ibanNumber: string;
    // Cambio de tipo string a un array de Address
    addresses: Address[];
    userData: UserData;
    firedDate: Date;
    hiredDate: Date;
    payments: number;
    specialCondition: Specialconditions = new Specialconditions();
    salary: number;
    payroll: boolean;
    // Cambiar hasPayrollShow por [] , creando el objeto y poniendo enable boolean y month string
    hasPayrollToShow: HasPayrollToShow = new HasPayrollToShow();
}
