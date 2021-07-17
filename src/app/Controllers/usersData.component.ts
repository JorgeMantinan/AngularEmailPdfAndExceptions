import { Component, OnInit, ViewChild } from '@angular/core';
import { UserData } from '../Model/userData';
import Swal from 'sweetalert2';
import { UserDataService } from '../Service/userData.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { Role } from '../Model/role';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-usuarios',
  templateUrl: '../View/usersData.component.html'
})
export class UsersDataComponent implements OnInit {


  roles: Role[];

  orderDas: boolean;
  orderName: boolean;
  orderSurname1: boolean;
  orderSurname2: boolean;
  orderEmail: boolean;
  orderState: boolean;

  ordenationBy: string;
  usersData: UserData[];
  paginator: any;
  page: number;
  order: boolean;
  route = '/manolito/usuarios/listar/pagina/';

  das = '';
  name = '';
  surname1 = '';
  surname2 = '';
  mail = '';
  state = 0;

  // dt003-DCS-12/11/2019 Añadir ActiveRoute
  constructor(private userDataService: UserDataService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService
              ) {// order = true => ordenacion ascendente
                // order = false => ordenacion descendente
                 this.orderDas = false;
                 this.orderName = false;
                 this.orderSurname1 = false;
                 this.orderSurname2 = false;
                 this.orderEmail = false;
                 this.orderState = false;
                 this.order = this.orderDas;
                }

  // dt003-DCS-12/11/2019 Modificacion de OnInit para la paginacion
  // dt003-DCS-14/11/2019 Añadir paginacion con ordenacion
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.page = +params.get('page');

      if (!this.page) {
        this.page = 0;
      }
      this.userDataService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1,
                                      this.surname2, this.mail, this.state).subscribe(response => {
        this.paginator = response;
        this.usersData = this.paginator.content;
      });

    });
  }

  applyFilters(das: string, name: string, surname1: string, surname2: string, mail: string, state: number) {
    this.das = das;
    this.name = name;
    this.surname1 = surname1;
    this.surname2 = surname2;
    this.mail = mail;
    this.state = state;
    this.userDataService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1,
                                    this.surname2, this.mail, state).subscribe(response => {
      this.paginator = response;
      this.usersData = this.paginator.content;
    });
  }

  delete(userData: UserData): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: this.translate.instant('userData.deleteUserPopupTitle'),
      text: this.translate.instant('userData.deleteUserPopupMsg', {das: userData.dasId}),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
      confirmButtonText: this.translate.instant('userData.deleteUserPopupBtnAccept'),
      cancelButtonText: this.translate.instant('userData.deleteUserPopupBtnCancel'),
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.userDataService.delete(userData.id).subscribe(
          response => {
          this.usersData = this.usersData.filter(usu => usu !== userData);
          swalWithBootstrapButtons.fire(
            this.translate.instant('userData.deleteUserOkPopupTitle'),
            this.translate.instant('userData.deleteUserOkPopupMsg', {das: userData.dasId}),
            'success'
          );
          this.userDataService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1,
                                          // tslint:disable-next-line: no-shadowed-variable
                                          this.surname2, this.mail, this.state).subscribe(response => {
            this.paginator = response;
            this.usersData = this.paginator.content;
            if (this.usersData.length === 0) {
              this.page = this.page - 1;
              this.router.navigate([this.route + this.page]);
            }
          });
        }
        );
      }
    });
  }

  // JMM-18/10/19
  // Oculta botones eliminar o editar
  avoidDeleteEdit(userData: UserData): boolean {
    if (this.authService.login.dasId !== userData.dasId) {
      return true;
    }
    return false;
  }

  // DT003-DCS-14/11/2019
  // Metodo para realizar las ordenaciones por los campos de la tabla
  ordenation(ordenationBy: string) {
    this.ordenationBy = ordenationBy;
    switch (this.ordenationBy) {
      case 'dasId':
        this.orderDas = this.changeOrder(this.orderDas);
        this.order = this.orderDas;
        this.orderName = false;
        this.orderSurname1 = false;
        this.orderSurname2 = false;
        this.orderEmail = false;
        this.orderState = false;
        break;
      case 'name':
        this.orderName = this.changeOrder(this.orderName);
        this.order = this.orderName;
        this.orderDas = false;
        this.orderSurname1 = false;
        this.orderSurname2 = false;
        this.orderEmail = false;
        this.orderState = false;
        break;
      case 'surname1':
        this.orderSurname1 = this.changeOrder(this.orderSurname1);
        this.order = this.orderSurname1;
        this.orderDas = false;
        this.orderName = false;
        this.orderSurname2 = false;
        this.orderEmail = false;
        this.orderState = false;
        break;
      case 'surname2':
        this.orderSurname2 = this.changeOrder(this.orderSurname2);
        this.order = this.orderSurname2;
        this.orderDas = false;
        this.orderName = false;
        this.orderSurname1 = false;
        this.orderEmail = false;
        this.orderState = false;
        break;
      case 'email':
        this.orderEmail = this.changeOrder(this.orderEmail);
        this.order = this.orderEmail;
        this.orderDas = false;
        this.orderName = false;
        this.orderSurname1 = false;
        this.orderSurname2 = false;
        this.orderState = false;
        break;
      case 'state':
        this.orderState = this.changeOrder(this.orderState);
        this.order = this.orderState;
        this.orderDas = false;
        this.orderName = false;
        this.orderSurname1 = false;
        this.orderSurname2 = false;
        this.orderEmail = false;
        break;
    }
    this.userDataService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1,
                                    this.surname2, this.mail, this.state).subscribe(response => {
      this.paginator = response;
      this.usersData = this.paginator.content;
    }
    );
    this.router.navigate([this.route + '0']);
  }

  changeOrder(order: boolean): boolean {
    if (order) {
      return false;
    } else {
      return true;
    }

  }
  // T2018-JMM-13/11/19
  getRolesPermissions(listRoles): Array<any> {
    return this.roles = listRoles;
  }

}
