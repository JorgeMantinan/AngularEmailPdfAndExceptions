import { AuthService } from '../../Service/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersDataExtendedService } from '../../Service/usersDataExtended.service';
import { UserDataExtended } from '../../Model/userDataExtended';
import Swal from 'sweetalert2';
import { AddressComponent } from 'src/app/Shared/address/address.component';
import {TranslateService} from '@ngx-translate/core';
import { PayrollComponent } from 'src/app/Shared/payroll/payroll.component';

@Component({
  selector: 'app-modify',
  templateUrl: '../../View//UserExtended/modify.component.html'
})
export class ModifyUserDataExtendedComponent implements OnInit {


  public userDataExtended: UserDataExtended = new UserDataExtended();
  public title = 'Modificar Datos Extendidos Usuario ';
  public idCardTypes = ['NIF', 'NIE', 'Pasaporte'];
  // Número del tipo de identificador: 0. Ningún identificador; 1. NIF; 2. NIE; 3. Pasaporte
  public selectedIdCardType = 0;
  // Número del documento identificador del usuario antes de realizar cambios.
  private originalIdCard: string;
  // Tipo de identificador original
  private originalIdCardType: number;

  public enableSetPayroll = false;
  @ViewChild('idCard', { static: true }) nameField: ElementRef;
  @ViewChild('Address', {static: false, read: AddressComponent}) public Address: AddressComponent;
  @ViewChild('Payroll', {static: false, read: AddressComponent}) public Payroll: PayrollComponent;

  constructor(private udeService: UsersDataExtendedService, private authService: AuthService,
              private router: Router, private activatedRoute: ActivatedRoute,
              private translate: TranslateService) {
      this.loadUserDataExtended();

  }
  ngOnInit() {
    this.Payroll.userDE = this.userDataExtended;
  }

  loadUserDataExtended(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params[`id`];
      if (id) {
        this.udeService.getUserDataExtended(id).subscribe((userDataExtended) => {
          this.userDataExtended = userDataExtended;
          for (const address of this.userDataExtended.addresses) {
            address.userdataextended = userDataExtended;
          }
          if (userDataExtended.nif == null) {
            if (userDataExtended.nie == null) {
              if (userDataExtended.passport == null) {
                this.selectedIdCardType = 0;
                this.originalIdCard = null;
              } else { // Es un pasaporte
                this.selectedIdCardType = 3;
                this.originalIdCard = userDataExtended.passport;
              }
            } else { // Es un nie
              this.selectedIdCardType = 2;
              this.originalIdCard = userDataExtended.nie;
            }
          } else { // Es un nif
            this.selectedIdCardType = 1;
            this.originalIdCard = userDataExtended.nif;
          }
          // Conservamos el tipo de identificador inicial para
          // recuperar el valor original.
          this.originalIdCardType = this.selectedIdCardType;
          // this.selectedIdCardType = userDataExtended.identityCardType;
          // this.originalIdCard = userDataExtended.identityCard;
          this.enablePayrollData(this.userDataExtended.id);
        });
      }
    });
  }
  getSelectedIdCardType() {
    // tslint:disable-next-line: triple-equals
    if (this.selectedIdCardType != this.originalIdCardType) {
      this.userDataExtended.nif = null;
      this.userDataExtended.nie = null;
    } else {
      if (this.selectedIdCardType === 1) {
        this.userDataExtended.nif = this.originalIdCard;
      } else if (this.selectedIdCardType === 2) {
        this.userDataExtended.nie = this.originalIdCard;
      } else if (this.selectedIdCardType === 3) {
        this.userDataExtended.passport = this.originalIdCard;
      }
      this.userDataExtended.identityCard = this.originalIdCard;
    }
    this.nameField.nativeElement.focus();
    // this.nameField.nativeElement.dirty;

  }

  update(): void {

    this.userDataExtended.identityCardType = this.selectedIdCardType;
    if (this.selectedIdCardType === 1) {
      this.userDataExtended.nif = this.userDataExtended.nif.toUpperCase();
    } else {
      this.userDataExtended.nie = this.userDataExtended.nie.toUpperCase();
    }
    for (const address of this.Address.listAddress) {
      if (address.userdataextended !== null) {
        address.userdataextended = null;
      }
    }
    this.userDataExtended.addresses = this.Address.listAddress;
    // this.userDataExtended.hiredDate.setDate(this.userDataExtended.hiredDate.getDate() + 1);
    this.udeService.update(this.userDataExtended)
      .subscribe(json => {
        if (this.authService.login.permissions.includes('ROLE_VER DATOS EXTENDIDOS')) {
          this.router.navigate(['/manolito/usuarios/datosextendidos/listar/pagina/0']);
          Swal.fire(this.translate.instant('usersDataExtended.modify.userDataModifySuccess'), '', 'success');
        } else {
          this.router.navigate(['/manolito/usuarios/misdatosextendidos']);
          Swal.fire(this.translate.instant('usersDataExtended.modify.userDataModifySuccess'), '', 'success');
        }
      },
        err => {
          // this.errors = err.error.errores as string[];
          // console.log(err.error.errores.toString());
        });
  }

  close(): void {
    // dtg008-JMM-10/12/19
    if (this.authService.login.permissions.includes('ROLE_VER DATOS EXTENDIDOS')) {
      this.router.navigate(['/manolito/usuarios/datosextendidos/listar/pagina/0']);
    } else {
      this.router.navigate(['/manolito/usuarios/misdatosextendidos']);
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
