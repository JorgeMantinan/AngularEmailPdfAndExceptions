import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../Service/login.service';
import { Login } from '../Model/login';
// FGS 27/11/19
import {TranslateService} from '@ngx-translate/core';

@Injectable()

// Manti 25/10/2019
export class AuthInterceptor implements HttpInterceptor {

  login: Login;

  constructor(private authService: AuthService, private router: Router, private loginService: LoginService,
              private translate: TranslateService) {
    this.login = new Login();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {

        switch (e.status) {
          case 401:
            if (this.authService.isAuthenticated()) {
              this.authService.logout();
            }
            this.router.navigate(['/manolito/login']);
            break;
          case 403:
            swal.fire(this.translate.instant('interceptor.accessDeniedTitle'),
                      this.translate.instant('guards.accessDeniedTitle'),
                      'warning');
            if (this.login.permissions.includes('ROLE_VER USUARIOS')) {
              this.router.navigate(['/usuarios/listar/pagina/0']);
            } else {
              this.router.navigate(['/welcome']);
            }
            break;
          default:
            break;
        }
        return throwError(e);
      })
    );
  }
}
