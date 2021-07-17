import { Component, OnInit} from '@angular/core';
import { Login } from '../Model/login';
import swal from 'sweetalert2';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { LoginService } from '../Service/login.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: '../View/login.component.html'
})
export class LoginComponent implements OnInit {

  PENDING_ACTIVATION = 1;
  ACTIVE = 2;
  INACTIVE = 4;
  login: Login;
  show = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    private translate: TranslateService) {
      this.login = new Login();
      this.show = false;
      // FGS 26/11/19. Para mensajes en ficheros externos
      // this.useLanguage('en');
    }

    ngOnInit() {
      // Para que no vuelva a cargar la pagina de login una vez ya autenticado
      if (this.authService.isAuthenticated()) {
        swal.fire(this.translate.instant('login.alreadyLoggedTitle'),
                  this.translate.instant('login.alreadyLoggedMsg', {das: this.authService.login.dasId}), 'info');
        if (this.login.state === this.PENDING_ACTIVATION) {
            this.router.navigate(['/manolito/activar', this.login.dasId]);
          } else {
              this.router.navigate(['/manolito/welcome']);
          }
      }
    }

  getLogin(): void {
    if (this.login.dasId == null || this.login.password == null) {
      swal.fire(this.translate.instant('login.errLoginTitle'),
                this.translate.instant('login.errLoginEmptyMsg'), 'error');
      return;
    }
    if (this.login.dasId.length === 0 || this.login.password.length === 0) {
      swal.fire(this.translate.instant('login.errLoginTitle'),
                this.translate.instant('login.errLoginEmptyMsg'), 'error');
      return;
    }
    this.authService.infoLogin(this.login).subscribe(response => {
      this.authService.saveLogin(response.access_token);
      this.login = this.authService.login;
      if (this.login.attemptsNum > 0) {
        switch (this.login.state) {
          case this.ACTIVE:
            this.router.navigate(['/manolito/welcome']);
            this.loginService.resetNum(this.login.id).subscribe();
            swal.fire({title: this.translate.instant('welcome.wlcmPageh3Msg'), showConfirmButton: false, timer: 1500});
            break;
          case this.INACTIVE:
            swal.fire(this.translate.instant('login.deactivatedAccountTitle'),
                      this.translate.instant('login.pendActivationAccountMsg'), 'info');
            this.authService.logout();
            break;
          case this.PENDING_ACTIVATION:
            swal.fire(this.translate.instant('login.deactivatedAccountTitle'),
                      this.translate.instant('login.pendActivationAccountMsg'), 'info');
            this.authService.logout();
            break;
        }
      } else {
        swal.fire(this.translate.instant('login.lockedAccountTitle'),
                  this.translate.instant('login.lockedAccountMsg'), 'info');
        this.authService.logout();
      }
    }, err => {
      switch (err) {
        case 400:
          //  29/11/19 Para controlar un das id inexistente y tratarlo como das o contraseña incorrecto
          this.loginService.updateAttempts(this.login.dasId).subscribe(login => {
            if (login.attemptsNum === 0) {
                swal.fire(this.translate.instant('login.lockedAccountTitle'),
                          this.translate.instant('login.lockedAccountMsg'), 'info');
              } else {
                swal.fire(this.translate.instant('login.errLoginTitle'),
                          this.translate.instant('login.errLoginBadCredentialsMsg'), 'error'); }
            }, error => {
              if (error.status === 404) {
                swal.fire(this.translate.instant('login.errLoginTitle'),
                          this.translate.instant('login.errLoginBadCredentialsMsg'), 'error');
              }
            }
          );
          break;
        case 401:
          // FGS 27/11/19. Este error se produce cuando cuando la cuenta está bloqueada (locked)
          swal.fire(this.translate.instant('login.deactivatedAccountTitle'),
          this.translate.instant('login.deactivatedAccountMsg'), 'info');
          break;
        default:
          // DCS 10/01/2020
          swal.fire(this.translate.instant('login.defaultErrorTitle'),
          this.translate.instant('login.defaultErrorMsg'), 'info');
      }
    });
  }

  viewPassword() {
    this.show = !this.show;
  }
  /**
   * Cambia el lenguaje de los mensajes mostrados en la vista.
   * @author FGS
   * @since 27/11/2019
   * @param language
   */
  useLanguage(language: string) {
    this.translate.use(language);
  }
}
