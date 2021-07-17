import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../../Service/role.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Role } from '../../Model/role';
import { UserData } from 'src/app/Model/userData';
import { DualListComponent } from '../../Shared/dualList/dualList.component';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from '../../../assets/i18n/es.json';
import { Permission } from 'src/app/Model/permission';

@Component({
  selector: 'app-modificar',
  templateUrl: '../../View/Role/modify.component.html'
})
export class ModifyRoleComponent implements OnInit {
  @ViewChild('Permissions', {static: false, read: DualListComponent}) public Permissions: DualListComponent;
  @ViewChild('UsersData', {static: false, read: DualListComponent}) public UsersData: DualListComponent;
  public role: Role = new Role();
  public title = 'ModificarRol ';
  errors: string[];
  public listUsersData: UserData[] = []; // Contiene la lista de usuarios que se añadirán al rol.
  public listPermissions: Permission[] = []; // Lista con todos los permisos que hay en la BD.
  // Contiene la lista de los roles seleccionados.
  public selectedPermissions: Permission[] = [];
  // Contiene la lista de los usuarios seleccionados.
  public selectedUsrs: UserData[] = [];

  constructor(private roleService: RoleService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService) {
                this.loadRole();
                // FGS 29/11/19. Para mensajes en ficheros externos
                translate.setTranslation('es', defaultLanguage);
                translate.setDefaultLang('es');
              }

  ngOnInit() {
  }

  loadRole(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params[`id`];
      if (id) {
        this.roleService.getRole(id).subscribe( (role) => {
          this.role = role;
        } );

        /*this.roleService.getUsersDataRole(id).subscribe(
          (usersData) => this.role.usersData = usersData);*/
      }
    });

  }
  public back(): void {
    this.router.navigate(['/manolito/roles/listar/pagina/0']);
  }

  update(): void {
    this.role.permissions = this.Permissions.listAssign;
    this.role.usersData = this.UsersData.listAssign;
    this.roleService.update(this.role)
    .subscribe(json => {
      this.router.navigate(['/manolito/roles/listar/pagina/0']);
      swal.fire(this.translate.instant('role.modify.roleUpdatedTitle'), '', 'success');
    },
    err => {
      this.errors = err.error.errors as string[];
    });
  }
}
