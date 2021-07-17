import { Component, OnInit } from '@angular/core';
import { UserDataExtended } from '../Model/userDataExtended';
import { UsersDataExtendedService } from '../Service/usersDataExtended.service';
import { AuthService } from '../Service/auth.service';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from '../Model/address';
import { HasPayrollToShow } from '../Model/hasPayrollToShow';


@Component({
  selector: 'app-userdataextended',
  templateUrl: '../View/usersdataextended.component.html'
})
export class UsersDataExtendedComponent implements OnInit {
  // FGS 15/11/19 lista con todos los datos extendidos recuperados.
  listUserDataExtended: UserDataExtended[];
  // JMM 31/12/19 Guarga un unico usuario para obtener una nómina
  listOneUserDataExtended: UserDataExtended[] = [];
  orderDas: boolean;
  // FGS 12/12/19 Ahora nif, nie y pasaporte están en 3 campos.
  orderNif: boolean;
  orderNie: boolean;
  orderPassport: boolean;
  orderNumSS: boolean;
  orderIban: boolean;
  ordenationBy: string;
  paginator: any;
  page: number;
  order: boolean;
  route = '/manolito/usuarios/datosextendidos/listar/pagina/';
  addresses: Address[];
  checked = false;
  allSelected = false;
  listUserPayroll: UserDataExtended[];
  lastPayroll: HasPayrollToShow;
  // JMM 13/01/20 Fecha de la última nómina disponible para cada usuario
  lastPayrollDate: string;
  constructor(private udeService: UsersDataExtendedService, private authService: AuthService,
              private activatedRoute: ActivatedRoute,  private translate: TranslateService,
              private router: Router
    ) {
       this.orderDas = false;
       this.orderIban = false;
       this.orderNif = false;
       this.orderNie = false;
       this.orderPassport = false;
       this.orderNumSS = false;
       this.order = this.orderDas;
      }

  public userDataExtended: UserDataExtended = new UserDataExtended();
  // Número del tipo de identificador: 0. Ningún identificador; 1. NIF; 2. NIE; 3. Pasaporte
  public selectedIdCardType = 0;
  // Número del documento identificador del usuario antes de realizar cambios.
  private originalIdCard: string;
  // @ViewChild('idCard', { static: true }) nameField: ElementRef;

  das = '';
  name = '';
  surname1 = '';
  nie = '';
  nif = '';
  passport = '';
  ssNumber = '';

  ngOnInit() {
    /*this.udeService.getListUserDataExtended().subscribe(
      (listUDE) => {
        return this.listUserDataExtended = listUDE;
      }
    );*/
    this.activatedRoute.paramMap.subscribe(params => {
      this.page = +params.get('page');

      if (!this.page) {
        this.page = 0;
      }

      if (this.authService.hasPermissions(['ROLE_VER DATOS EXTENDIDOS'])) {
        this.udeService
          .useFilters(
            this.page,
            this.ordenationBy,
            this.order,
            this.das,
            this.name,
            this.surname1,
            this.nie,
            this.nif,
            this.passport,
            this.ssNumber
          )
          .subscribe(response => {
            this.paginator = response;
            this.listUserDataExtended = this.paginator.content;
            for (const userDataExtended of this.listUserDataExtended) {
              userDataExtended.payroll = false;

              // FGS 09/01/2020 Determino si el usuario tiene nómina para mostrar
              this.hasPayrollToShow(userDataExtended);
            }
          });
      } else {
        this.loadUserDataExtended();
      }
    });
  }

  loadUserDataExtended(): void {
    this.activatedRoute.params.subscribe(params => {
      // dtg003-JMM-05/12/19
      // Se añadió el id para obtener el usuario logueado para permitir ver sus datos,crearlos y modificarlos
      const id = this.authService.login.id;
      if (id) {
        this.udeService.getUserDataExtended(id).subscribe(userDataExtended => {
          this.userDataExtended = userDataExtended;
          this.selectedIdCardType = userDataExtended.identityCardType;
          this.originalIdCard = userDataExtended.identityCard;
        });
      }
    });
  }

  avoidDelete(userDataExtended: UserDataExtended): boolean {
    if (this.authService.login.dasId !== userDataExtended.userData.dasId) {
      return true;
    }
    return false;
  }

  ordenation(ordenationBy: string) {
    this.ordenationBy = ordenationBy;
    switch (this.ordenationBy) {
      case 'u.das_id':
        this.orderDas = this.changeOrder(this.orderDas);
        this.order = this.orderDas;
        this.orderNif = false;
        this.orderNie = false;
        this.orderPassport = false;
        this.orderNumSS = false;
        break;
      case 'nif':
        this.orderNif = this.changeOrder(this.orderNif);
        this.order = this.orderNif;
        this.orderNie = false;
        this.orderPassport = false;
        this.orderDas = false;
        this.orderNumSS = false;
        break;
      case 'nie':
        this.orderNie = this.changeOrder(this.orderNie);
        this.order = this.orderNie;
        this.orderNif = false;
        this.orderPassport = false;
        this.orderDas = false;
        this.orderNumSS = false;
        break;
      case 'passport':
        this.orderPassport = this.changeOrder(this.orderPassport);
        this.order = this.orderPassport;
        this.orderNif = false;
        this.orderNie = false;
        this.orderDas = false;
        this.orderNumSS = false;
        break;
      case 'ss_number':
        this.orderNumSS = this.changeOrder(this.orderNumSS);
        this.order = this.orderNumSS;
        this.orderNif = false;
        this.orderNie = false;
        this.orderPassport = false;
        this.orderDas = false;
        break;
    }
    this.udeService
      .useFilters(
        this.page,
        this.ordenationBy,
        this.order,
        this.das,
        this.name,
        this.surname1,
        this.nie,
        this.nif,
        this.passport,
        this.ssNumber
      )
      .subscribe(response => {
        this.paginator = response;
        this.listUserDataExtended = this.paginator.content;
        for (const userDataExtended of this.listUserDataExtended) {
          userDataExtended.payroll = false;
        }
      });
    this.router.navigate([this.route + '0']);
  }

  // DCS dtg011 03/12/2019
  changeOrder(order: boolean): boolean {
    if (order) {
      return false;
    } else {
      return true;
    }
  }



  getAddresses(addressList: Address[]) {
    this.addresses = addressList;
  }

  /**
   *
   * @author FGS
   * @since  20/11/2019
   * @param userData
   */
  delete(ude: UserDataExtended): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: this.translate.instant('usersDataExtended.deleteUserDataPopupTitle'),
      text: this.translate.instant('usersDataExtended.deleteUserDataPopupMsg', { das: ude.userData.dasId }),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
      confirmButtonText: this.translate.instant('usersDataExtended.colDeleteTitle'),
      cancelButtonText: this.translate.instant('usersDataExtended.deleteUserDataPopupBtnCancel'),
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.udeService.delete(ude.id).subscribe(
          response => {
            this.listUserDataExtended = this.listUserDataExtended.filter(usu => usu !== ude);
            swalWithBootstrapButtons.fire(
              this.translate.instant('usersDataExtended.deleteUserDataOkPopupTitle'),
              this.translate.instant('usersDataExtended.deleteUserDataOkPopupMsg', { das: ude.userData.dasId }),
              'success'
            );
          });
        }
      });
  }

  addAll() {
    for (const user of this.listUserDataExtended) {
      if (user.hasPayrollToShow) {
      user.payroll = !this.checked;
      }
    }
  }


  download() {
    this.listUserPayroll = [];
    if (this.checked) {
      for (const user of this.listUserDataExtended) {
        if (user.hasPayrollToShow) {
          this.listUserPayroll.push(user);
        }
      }
    } else {
      for (const user of this.listUserDataExtended) {
        if (user.payroll) {
          this.listUserPayroll.push(user);
        }
      }
    }
    if (this.listUserPayroll.length !== 0) {
      // this.udeService.downloadPayroll(this.listUserPayroll).subscribe();
    } else {
      Swal.fire(this.translate.instant('userDataExtended.payroll.unselectedPayrolls'),
          this.translate.instant('userDataExtended.payroll.selectPayrollsToDownload'), 'info');
    }
  }

  applyFilters(
    das: string,
    name: string,
    surname1: string,
    nie: string,
    nif: string,
    passport: string,
    ssNumber: string
  ) {
    this.das = das;
    this.name = name;
    this.surname1 = surname1;
    this.nie = nie;
    this.nif = nif;
    this.passport = passport;
    this.ssNumber = ssNumber;
    this.udeService
      .useFilters(
        this.page,
        this.ordenationBy,
        this.order,
        this.das,
        this.name,
        this.surname1,
        this.nie,
        this.nif,
        this.passport,
        this.ssNumber
      )
      .subscribe(response => {
        this.paginator = response;
        this.listUserDataExtended = this.paginator.content;
        for (const userDataExtended of this.listUserDataExtended) {
          userDataExtended.payroll = false;
        }
      });
  }

  /**
   * Comprueba si tiene el permiso ROLE_DESCARGAR NOMINAS para pintar o no el checkbox a seleccionar
   * @author JMM
   * @since 09/01/2020
   * @branch T3025
   *
   */
  checkedDowloadPayroll(userDataExtended: UserDataExtended): boolean {
    if (
      this.authService.login.dasId !== userDataExtended.userData.dasId &&
      !this.authService.hasPermissions(['ROLE_DESCARGAR NOMINAS'])
    ) {
      return false;
    }
    return true;
  }

  /**
   * Comprueba si tiene el permiso ROLE_VER NOMINAS o si es el propio usuario
   * @author JMM
   * @since 09/01/2020
   * @branch T3025
   *
   */
  viewPayrolls(userDataExtended: UserDataExtended): boolean {
    if (
      this.authService.login.dasId !== userDataExtended.userData.dasId &&
      !this.authService.hasPermissions(['ROLE_VER NOMINAS'])
    ) {
      return false;
    }
    return true;
  }

  /**
   *
   * @author FGS
   * @since 08/01/2020
   * @branch T3023
   *
   */
  hasPayrollToShow(ude: UserDataExtended) {
    // DT3004 JMM 13/01/20 Obtención del mes de la última nómina
    this.udeService.hasPayrollToShow(ude.id).toPromise().then(
      (response: HasPayrollToShow) => {
        if (response) {
          ude.hasPayrollToShow = response as HasPayrollToShow;
          return ude.hasPayrollToShow;
        }
      }
    );
  }

  ordenationDas() {
    this.listUserDataExtended
  }
}
