import { UserData } from './userData';
export class Login {
    // dtg003-JMM-05/12/19
    // Se añadió el id para obtener el usuario logueado para permitir ver sus datos,crearlos y modificarlos
    id: number;
    dasId: string;
    password: string;
    attemptsNum: number;
    userData: UserData;
    state: number;
    roles: string [] = [];
    permissions: string [] = [];
  }
