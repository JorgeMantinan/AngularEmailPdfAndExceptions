import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from "./../../assets/i18n/es.json";

@Injectable({
  providedIn: 'root'
})
// T2016 JMM 7/11/2019
export class PermissionGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router, private translate: TranslateService) {
      // FGS 28/11/19. Para mensajes en ficheros externos
      translate.setTranslation('es', defaultLanguage);
      translate.setDefaultLang('es');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (!this.authService.isAuthenticated()) {
        swal.fire(this.translate.instant('guards.accessDeniedTitle'), this.translate.instant('guards.accessDeniedMsg'), 'warning');
        this.router.navigate(['/manolito/login']);
        return false;
      }

      const permission = next.data['permission'] as string[];
      if (this.authService.hasPermissions(permission)) {
        return true;
      }
      this.router.navigate(['/manolito/welcome']);
      return false;
  }
}
