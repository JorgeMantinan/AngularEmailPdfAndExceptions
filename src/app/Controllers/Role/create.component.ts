import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';

import { Role } from '../../Model/role';
import { RoleService } from '../../Service/role.service';
import Swal from 'sweetalert2';
import { DualListComponent } from '../../Shared/dualList/dualList.component';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from '../../../assets/i18n/es.json';

@Component({
  selector: 'app-crear',
  templateUrl: '../../View/Role/create.component.html'
})
export class CreateRoleComponent implements OnInit {

  public role: Role = new Role();

  // Contiene la lista de los roles seleccionados.
  @ViewChild('Permissions', {static: false}) public Permissions: DualListComponent;
  @ViewChild('UsersData', {static: false}) public UsersData: DualListComponent;

  constructor(private roleService: RoleService, private router: Router,
              private translate: TranslateService) {
    // FGS 29/11/19. Para mensajes en ficheros externos
    translate.setTranslation('es', defaultLanguage);
    translate.setDefaultLang('es');
  }

  ngOnInit() {
  }

  public back(): void {
    this.router.navigate(['/manolito/roles/listar/pagina/0']);
  }

  public create(): void {
      this.role.permissions = this.Permissions.listAssign;
      this.role.usersData = this.UsersData.listAssign;
      this.roleService.create(this.role).subscribe(
      () => {this.router.navigate(['/manolito/roles/listar/pagina/0']);
             Swal.fire(this.translate.instant('role.create.newRoleCreateTitle'), '',  'success'); }
    );
  }

}
