import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Service/auth.service';
import { UsersDataExtendedService } from '../Service/usersDataExtended.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataExtended } from '../Model/userDataExtended';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Address } from '../Model/address';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-data-extended',
  templateUrl: '../View/userDataExtended.component.html'
})
export class UserDataExtendedComponent implements OnInit {

  public userDataExtended: UserDataExtended = new UserDataExtended();
  // Número del tipo de identificador: 0. Ningún identificador; 1. NIF; 2. NIE; 3. Pasaporte
  public selectedIdCardType = 0;
  // @ViewChild('idCard', { static: true }) nameField: ElementRef;
  public isDasIdUndefined = false;
  route = '/manolito/usuarios/datosextendidos/listar/pagina/';
  private urlEndPoint = 'http://10.0.0.105:8080/manolito/usuarios/datosextendidos';
  addresses: Address[];


  constructor(
    private udeService: UsersDataExtendedService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) { }


  ngOnInit() {
    this.loadUserDataExtended();
  }

  loadUserDataExtended(): void {
    this.activatedRoute.params.subscribe(params => {
      // dtg008-JMM-05/12/19
      // Se añadió el id para obtener el usuario logueado para permitir ver sus datos,crearlos y modificarlos
      const id = this.authService.login.id;

      if (id) {
        this.getUserDataExtended(id).subscribe((userDataExtended) => {
          this.userDataExtended = userDataExtended;
          if (userDataExtended.userData.dasId === undefined) {
            this.isDasIdUndefined = true;
          } else {
            this.isDasIdUndefined = false;
          }
          this.addresses = userDataExtended.addresses;
        });
      }
    });
  }

  /**
   *
   * @author JMM
   * @since  10/12/2019
   * @param id
   */
  getUserDataExtended(id: number): Observable<UserDataExtended> {
    return this.http.get<UserDataExtended>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        switch (e.status) {
          case 401:
            Swal.fire(this.translate.instant('usersDataExtended.withoutPermissions'), e.error.message, 'error');
            this.router.navigate(['manolito/welcome']);

            break;
          default:
            this.isDasIdUndefined = true;
            this.router.navigate(['manolito/usuarios/misdatosextendidos']);
            break;
        }
        return throwError(e);
      })
    );
  }

  getAddresses(addressList: Address[]) {
    this.addresses = addressList;
  }

}
