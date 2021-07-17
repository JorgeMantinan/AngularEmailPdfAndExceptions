import { Component, OnInit} from '@angular/core';
import { Login } from './login';
import swal from 'sweetalert2';
import { AuthService } from '../usersData/auth.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import {TranslateService} from '@ngx-translate/core';
import { UserDataService } from '../usersData/userData.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  PENDING_ACTIVATION = 1;
  ACTIVE = 2;
  INACTIVE = 4;

  // title = 'Entrar';
  // das = 'Das Id';
  // password = 'Contraseña';
  login: Login;
  show = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    private translate: TranslateService,
    private userService: UserDataService) {
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
      swal.fire(this.translate.instant('login.errLoginTitle'), this.translate.instant('login.errLoginEmptyMsg'), 'error');
      return;
    }
    if (this.login.dasId.length === 0 || this.login.password.length === 0) {
      swal.fire(this.translate.instant('login.errLoginTitle'), this.translate.instant('login.errLoginEmptyMsg'), 'error');
      return;
    }
    this.authService.infoLogin(this.login).subscribe(response => {
      this.authService.saveLogin(response.access_token);
      this.authService.saveToken(response.access_token);
      //this.authService.saveLogin(response.refresh_token);
      const login = this.authService.login;
      if (login.attemptsNum > 0 && login.state === this.ACTIVE)  {
          this.router.navigate(['/manolito/welcome']);
          this.loginService.resetNum(login.id).subscribe();
          swal.fire({
            title: 'Bienvenido', showConfirmButton: false, timer: 1500});
      } else if (login.state === this.INACTIVE) {
        swal.fire(this.translate.instant('login.deactivatedAccountTitle'), this.translate.instant('login.deactivatedAccountMsg'), 'info');
        this.authService.logout();
      } else if (login.state === this.PENDING_ACTIVATION) {
        swal.fire(this.translate.instant('login.deactivatedAccountTitle'),
          this.translate.instant('login.pendActivationAccountMsg'), 'info');
        this.authService.logout();
      } else {
        swal.fire(this.translate.instant('login.lockedAccountTitle'), this.translate.instant('login.lockedAccountMsg'), 'info');
        this.authService.logout();
      }
    }, err => {
      if (err.status === 400) {
        //  29/11/19 Para controlar un das id inexistente y tratarlo como das o contraseña incorrecto
        // if (this.userService.isDasRegistered(this.login.dasId)) { // Si tiene permisos es que el das existe en la bd.
        if (this.login.attemptsNum !== undefined) { // Si tiene permisos es que el das existe en la bd.
          this.loginService.updateAttempts(this.login.dasId).subscribe(login => {
            if (login.attemptsNum === 0) {
                swal.fire(this.translate.instant('login.lockedAccountTitle'), this.translate.instant('login.lockedAccountMsg'), 'info');
              } else {
                swal.fire(this.translate.instant('login.errLoginTitle'),
                  this.translate.instant('login.errLoginBadCredentialsMsg'), 'error');
              }
            }
            );
         }  else { // El DAS ID no existe pero lo tratamos como si fuera un error de das o de contraseña
          swal.fire(this.translate.instant('login.errLoginTitle'), this.translate.instant('login.errLoginBadCredentialsMsg'), 'error');
        }

      }
      // FGS 27/11/19. Este error se produce cuando cuando la cuenta está bloqueada (locked)
      if (err.status === 401) {
        swal.fire(this.translate.instant('login.deactivatedAccountTitle'), this.translate.instant('login.deactivatedAccountMsg'), 'info');
      }
    }
    );
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
