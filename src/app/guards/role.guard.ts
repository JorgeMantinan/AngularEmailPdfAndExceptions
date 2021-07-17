import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from './../../assets/i18n/es.json';

@Injectable({
  providedIn: 'root'
})
// Manti 24/10/2019
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,
              private translate: TranslateService) {
      // FGS 28/11/19. Para mensajes en ficheros externos
      translate.setTranslation('es', defaultLanguage);
      translate.setDefaultLang('es');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.authService.isAuthenticated()) {
        swal.fire(this.translate.instant('guards.accessDeniedTitle'),
          this.translate.instant('guards.accessDeniedMsg'), 'warning');
        this.router.navigate(['/manolito/login']);
        return false;
      }

      /*let role = next.data['role'] as string;
      if(this.authService.hasRole(role)){
        return true;
      }*/
      swal.fire(this.translate.instant('guards.accessDeniedTitle'),
        this.translate.instant('guards.accessDeniedTitle', {das: 'this.authService.login.dasId'}), 'warning');
      if (this.authService.login.roles.includes('ROLE_VER USUARIOS')) {
        this.router.navigate(['/manolito/usuarios/listar/pagina/0']);
      } else if (this.authService.login.roles.includes('ROLE_PERMISO_BASICO')) {
        this.router.navigate(['/manolito/welcome']);
      }
      return true;
  }
}
