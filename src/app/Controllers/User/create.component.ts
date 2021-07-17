
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserData } from '../../Model/userData';
import { UserDataService } from '../../Service/userData.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DualListComponent } from 'src/app/Shared/dualList/dualList.component';

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-crear',
  templateUrl: '../../View/User/create.component.html'
})
export class CreateUsrComponent implements OnInit {
  // Recoge los datos del usuario que se va a crear.
  public userData: UserData = new UserData();

  @ViewChild('Roles', {static: false, read: DualListComponent}) public Roles: DualListComponent;
  // Recoge la posible lista de errores devuelta por el backend.
  public errors: string[] = [];

   // FGS 05/11/19 Para comprobar si existe un dasid
   public isDasAlreadyInUse = true;

  constructor(private userDataService: UserDataService,
              private router: Router, private translate: TranslateService) {
              }

  ngOnInit() {
  }
  // FGS 04/11/19. Método para comprobar la existencia de un DAS ID en la BD.
  public findByDasId(dasId: string): void {

    let existsUser = false;
    let message = this.translate.instant('userData.create-modify.dasAlreadyInUseMsg', {das: dasId});

    this.userDataService.isDasRegistered(dasId, -1).subscribe((res: boolean) => {
      existsUser = res;
      this.isDasAlreadyInUse = existsUser;
      if (!existsUser) {
        message = this.translate.instant('userData.create-modify.dasNotInUseMsg', {das: dasId});
      }
      Swal.fire('',
          '<strong>' + message + '</strong>',
          'info'
        );
    });

  }

  public back(): void {
    this.router.navigate(['/manolito/usuarios/listar/pagina/0']);
  }

  public create(): void {
    this.userData.roles = this.Roles.listAssign;
    this.userDataService.create(this.userData).subscribe(
      response => {
        this.router.navigate(['/manolito/usuarios/listar/pagina/0']);
        Swal.fire(this.translate.instant('userData.create.newUserCreatedTitle'), '',  'success');
        }
    );
  }

}
