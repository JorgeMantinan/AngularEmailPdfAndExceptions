import { AuthService } from '../../Service/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataExtended } from '../../Model/userDataExtended';
import { UsersDataExtendedService } from '../../Service/usersDataExtended.service';
import { Router } from '@angular/router';
import { UserData } from 'src/app/Model/userData';
import { UserDataService } from 'src/app/Service/userData.service';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { AddressComponent } from 'src/app/Shared/address/address.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: '../../View/UserExtended/create.component.html'
})

/**
 *
 * @author FGS
 * @since  15/11/2019
 */
export class CreateUserDataExtendedComponent implements OnInit {

  // Recoge los datos del usuario que se va a crear.
  public userDataExtended: UserDataExtended = new UserDataExtended();
  public titulo = 'Crear Datos Extendidos del usuario';
  // FGS 18/11/19. Lista con todos los usuarios sin datos extendidos.
  public listUserData: UserData[];
  // Usuario cuyos datos extendidos se van a crear.
  public userDataSelected: UserData = new UserData();
  public idCardTypes = ['NIF', 'NIE', 'Pasaporte'];
  // Número del tipo de identificador: 0. Ningún identificador; 1. NIF; 2. NIE; 3. Pasaporte
  public selectedIdCardType = 1;

  public enableSetPayroll = false;


  public udeForm: FormGroup;

  @ViewChild('Address', { static: false, read: AddressComponent }) public Address: AddressComponent;

  constructor(private udeService: UsersDataExtendedService, private userDataService: UserDataService,
              private authService: AuthService, private router: Router, private translate: TranslateService) {

  }

  ngOnInit() {
   if (!this.authService.login.permissions.includes('ROLE_CREAR DATOS EXTENDIDOS')) {
      // FGS 16/12/19
      this.userDataExtended.id = this.authService.login.id;
    } else {
      this.userDataService.getUsersWithoutDataExtended().subscribe(usersData => {
        this.listUserData = usersData;
        this.userDataSelected = this.listUserData[0]; // FGS Preselecciono el primer usuario de la lista
        this.enablePayrollData(this.userDataSelected.id);
      });
    }
   this.userDataExtended.nif = null;
   this.userDataExtended.nie = null;
   this.userDataExtended.passport = null;
   this.userDataExtended.identityCardType = 0;

  }

  public back() {
    // dtg008-JMM-10/12/19
    if (this.authService.login.permissions.includes('ROLE_VER DATOS EXTENDIDOS')) {
      this.router.navigate(['/manolito/usuarios/datosextendidos/listar/pagina/0']);
    } else {
      this.router.navigate(['/manolito/usuarios/misdatosextendidos']);
    }
  }

  public getUserDataSelected() {
    // FGS. Asigno el id del usuario seleccionado al objeto con los datos extendidos de dicho usuario.
    this.userDataExtended.id = this.userDataSelected.id;
    this.enablePayrollData(this.userDataExtended.id);
  }

  getSelectedIdCardType() {
    // tslint:disable-next-line: triple-equals
      this.userDataExtended.identityCardType = this.selectedIdCardType;
  }
  // FGS 20/11/2019
  public create(): void {
    this.setIdentityCard(this.userDataExtended.identityCardType);

    this.userDataExtended.userData = this.userDataSelected;
    // FGS El usuario de RRHH está creando los datos de otro usuario.
    if (this.userDataExtended.id === undefined) {
      this.userDataExtended.id = this.userDataSelected.id;
    }
    if (this.userDataExtended.ssNumber != null && this.userDataExtended.ssNumber.length < 12) {
      this.userDataExtended.ssNumber = null;
    }
    if (this.userDataExtended.ibanNumber != null && this.userDataExtended.ibanNumber.length < 12) {
      this.userDataExtended.ibanNumber = null;
    }
    this.userDataExtended.addresses = this.Address.listAddress;
    this.udeService.create(this.userDataExtended).subscribe(
      response => {
        if (this.authService.login.permissions.includes('ROLE_CREAR DATOS EXTENDIDOS')) {
          this.router.navigate(['/manolito/usuarios/datosextendidos/listar/pagina/0']);
          Swal.fire(this.translate.instant('usersDataExtended.create.newUserDataCreatedTitle'), '', 'success');
        } else {
          this.router.navigate(['/manolito/usuarios/misdatosextendidos']);
          Swal.fire(this.translate.instant('usersDataExtended.create.newUserDataCreatedTitle'), '', 'success');
        }
      }
    );
  }

  /**
   * Este método setea los campos nif/nie/pasaporte en función del tipo de identificador elegido.
   *
   * @param cardType
   * @author FGS
   * @since 17/12/2019
   */
  setIdentityCard(cardType: number) {
    if (cardType === 1) {
      this.userDataExtended.nie = null;
    } else if (cardType === 2) {
      this.userDataExtended.nif = null;
    }
  }

  /**
   * Este método comprueba si el usuario del combo coincide con el logueado.
   * Si el usuario es el mismo, no le muestra los campos de la nómina.
   *
   * @param id
   * @author JMM
   * @since 09/01/20
   */
  enablePayrollData(id: number) {
    if (id !== this.authService.login.id) {
      this.enableSetPayroll = true;
    } else {
      this.enableSetPayroll = false;
    }
  }

}

