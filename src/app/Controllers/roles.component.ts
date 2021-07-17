import { UserDataService } from 'src/app/Service/userData.service';
import { Component, OnInit } from '@angular/core';
import {RoleService } from '../Service/role.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import {TranslateService} from '@ngx-translate/core';
import { UserData } from '../Model/userData';
import { Permission } from '../Model/permission';
import { Role } from '../Model/role';

@Component({
  selector: 'app-roles',
  templateUrl: '../View/roles.component.html'
})
export class RolesComponent implements OnInit {

  userData: UserData = new UserData();
  permissions: Permission[];
  roles: Role[];
  roleName = '';
  // DT018-DCS-15/11/2019 Añadir elementos para la paginacion con ordenacion
  orderName: boolean;
  ordenationBy: string;
  paginator: any;
  page: number;
  order: boolean;
  route = '/manolito/roles/listar/pagina/';

  das = '';
  name = '';
  surname1 = '';

  constructor(private userDataService: UserDataService,
              private roleService: RoleService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService) {
                this.loadUserData();
                this.orderName = true;
                this.order = this.orderName;
                // FGS 29/11/19. Para mensajes en ficheros externos
              }

  ngOnInit() {
    // DT018-DCS-15/11/2019 Aplicar la paginacion con filtros a roles
    this.activatedRoute.paramMap.subscribe(params => {
      this.page = +params.get('page');

      if (!this.page) {
        this.page = 0;
      }
      this.roleService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1).subscribe(response => {
        this.paginator = response;
        this.roles = this.paginator.content;
      });

    });
  }

  // Método para borrar un rol
  delete(role: Role): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: this.translate.instant('role.deleteRolePopupTitle'),
      text: this.translate.instant('role.deleteRolePopupMsg', {name: role.name}),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
      confirmButtonText: this.translate.instant('role.deleteRolePopupBtnAccept'),
      cancelButtonText: this.translate.instant('role.deleteRolePopupBtnCancel'),
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.roleService.delete(role.id).subscribe(
          response => {
          // tslint:disable-next-line: variable-name
          this.roles = this.roles.filter(_role => _role !== role);
          swalWithBootstrapButtons.fire(
            this.translate.instant('role.deleteRoleOkPopupTitle'),
            this.translate.instant('role.deleteRoleOkPopupMsg', {name: role.name}),
            'success'
          );
          // tslint:disable-next-line: no-shadowed-variable
          this.roleService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1).subscribe(response => {
            this.paginator = response;
            this.roles = this.paginator.content;
            if (this.roles.length === 0) {
              this.page = this.page - 1;
              this.router.navigate([this.route + this.page]);
            }
          });
        }
        );
      }
    });
  }

  // DT018-DCS-15/11/2019
  ordenation(ordenationBy: string) {
    this.ordenationBy = ordenationBy;
    switch (this.ordenationBy) {
      case 'name':
        this.orderName = this.changeOrder(this.orderName);
        this.order = this.orderName;
        break;
    }
    this.roleService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1).subscribe(response => {
      this.paginator = response;
      this.roles = this.paginator.content;
    });
  }

  changeOrder(order: boolean): boolean {
    if (order) {
      return false;
    } else {
      return true;
    }
  }

  // dtg015-JMM-16/12/19
  loadUserData(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = this.authService.login.id;
      if (id) {
        this.userDataService.getUserData(id).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });
  }

  getRolesPermissions(listPermissions): Array<any> {
    return this.permissions = listPermissions;
  }

  /**
   * Comprueba si el rol que se le pasa por parametro es el ADMIN (dicho rol nunca puede ser eliminado).
   * @branch dtg015
   * @author JMM
   * @since 16/12/2019
   * @param role
   */
  isRoleAdmin(roleName): boolean {
    if (roleName === 'ADMIN') {
      return true;
    }
    return false;
  }

  /**
   * Comprueba si el usuario tiene el rol que se le pasa por parametro.
   * @branch dtg015
   * @author JMM
   * @since 16/12/2019
   * @param role
   */
  hasRole(role): boolean {
    for (let i = 0, len = this.userData.roles.length; len > i; i++) {
      if (this.userData.roles[i].name.includes(role.name)) {
        return true;
      }
    }
    return false;
  }

  applyFilters(das: string, name: string, surname1: string) {
    this.das = das;
    this.name = name;
    this.surname1 = surname1;
    this.roleService.useFilters(this.page, this.ordenationBy, this.order, this.das, this.name, this.surname1).subscribe(response => {
      this.paginator = response;
      this.roles = this.paginator.content;
    });
  }
}
