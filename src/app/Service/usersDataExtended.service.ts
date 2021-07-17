import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UserDataExtended } from '../Model/userDataExtended';

@Injectable({
  providedIn: 'root'
})
export class UsersDataExtendedService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/usuarios/datosextendidos';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router,
              private authService: AuthService,
              private translate: TranslateService) { }


  private agregarAuthorizationHeader() {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  useFilters(page: number, ordenationBy: string, order: any, das: string, name: string, surname1: string,
             nie: string , nif: string, passport: string, ssNumber: string): Observable<UserDataExtended[]> {
    if (ordenationBy === undefined) {
      ordenationBy = 'user_data_id';
    }
    const parameters = new HttpParams().set('order', order)
      .append('ordenationBy', ordenationBy)
      .append('dasId', das)
      .append('name', name)
      .append('surname1', surname1)
      .append('nie', nie)
      .append('nif', nif)
      .append('passport', passport)
      .append('ssNumber', ssNumber);
    return this.http.get(this.urlEndPoint + '/listar/pagina/' + page, { headers: this.httpHeaders, params: parameters }).pipe(
      map((response: any) => {
        // tslint:disable-next-line: no-shadowed-variable
        (response.content as UserDataExtended[]).map( UserDataExtended => {
          return UserDataExtended;
        });
        return response;
      }));
  }
  // FGS 15/11/19 Método que recupera los datos extendidos de los usuarios que posean dicha información.
  _getListUserDataExtended(): Observable<UserDataExtended[]> {

    return this.http.get(this.urlEndPoint + '/listar', { headers: this.agregarAuthorizationHeader() }).pipe(
      map(response => {
        const listUDE = response as UserDataExtended[];
        return listUDE.map(ude => {
          return ude;
        });
      })
    );
  }

  /**
   *
   * @author FGS
   * @since  20/11/2019
   * @param id
   */
  getUserDataExtended(id: number): Observable<UserDataExtended> {
    return this.http.get<UserDataExtended>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.status !== 404 && e.error.message) {
          Swal.fire('Error al editar', e.error.message, 'error');
          this.router.navigate(['manolito/usuarios/datosextendidos/listar/pagina/0']);
        } else if (e.status === 404) {
          Swal.fire(this.translate.instant('usersDataExtended.service.nonexistentUserDataErrMsg'), e.error.message, 'error');
        } else {
          Swal.fire('Error', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  /**
   *
   * @author FGS
   * @since  20/11/2019
   * @param userDataExtended
   *
   */
  create(userDataExtended: UserDataExtended): Observable<UserDataExtended> {
    return this.http.post(this.urlEndPoint + '/crear', userDataExtended).pipe(
      map((response: any) => response.userData as UserDataExtended),
      catchError(e => {

        const arrayErrors: string[] = e.error.error;
        let error = '';
        if (arrayErrors != null) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < arrayErrors.length; i++) {
            error = error + '<br>' + arrayErrors[i];
          }
        }


        if (e.status === 400) {

          /**
           * Obtiene la cadena de errores del back y sustituye lineBreak por <br>.
           *
           * @var lineBreak es la cadena de String que viene del back para remplazarlo en frontal por un salto de linea,
           * debido al uso de regex en el replace.
           * @author JMM
           * @since  28/11/2019
           *
           */
          let errors = e.error.errors;
          const lineBreak = /lineBreak/;
          errors = errors.replace(lineBreak, '<br>');

          Swal.fire(e.error.mensaje, errors, 'error');
          return throwError(e);
        }

        Swal.fire(e.error.message, this.translate.instant('usersDataExtended.service.createUserDataErrMsg'), 'error');
        return throwError(e);
      })
    );
  }

  /**
   *
   * @author FGS
   * @since  20/11/2019
   * @param userDataExtended
   *
   */
  update(userDataExtended: UserDataExtended): Observable<UserDataExtended> {
    return this.http.put<any>(`${this.urlEndPoint}` + '/modificar/' + userDataExtended.id, userDataExtended).pipe(
      map((response: any) => response.userData as UserDataExtended),
      catchError(e => {
        const arrayErrors: string[] = e.error.error;
        let error = '';
        if (arrayErrors != null) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < arrayErrors.length; i++) {
            error = error + '<br>' + arrayErrors[i];
          }
        }
        if (e.status === 102) { // El servidor backend está caído.
          return throwError(e);
        }
        if (e.status === 400) {
          Swal.fire(this.translate.instant('usersDataExtended.service.modifyUserDataErrMsg'), error, 'error');
          return throwError(e);
        }
        Swal.fire(this.translate.instant('usersDataExtended.service.modifyUserDataErrMsg'), error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Elimina los datos extendidos de un usuario cuyo id recibe como parámetro.
   * @author FGS
   * @since  20/11/19
   * @param id
   */
  delete(id: number): Observable<UserDataExtended> {
    return this.http.delete<UserDataExtended>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  /**
   * Descarga una o más nóminas
   *
   * @author JMM
   * @since  23/12/19
   */
  downloadPayroll(listUserDataExtended: UserDataExtended[]) {
    return this.http.post<UserDataExtended[]>(`${this.urlEndPoint}/nominas/descarga`, listUserDataExtended).pipe(
      map((response: any) => {
        Swal.fire('', response.message,
            'success');
      }),
      catchError(e => {
        if (e.status) {
          Swal.fire(this.translate.instant('userDataExtended.payroll.downloadErrMsg'),
                    this.translate.instant('userDataExtended.payroll.contactSupportErrorMsg'),
                    'error');
        }
        return throwError(e);
      })
    );
  }

  // FGS 17/12/19. Método para comprobar la existencia de un nif, nie o pasaporte en el sistema
  public isIdCardRegistered(idCard: string, typeCard: any, userId: any) {
    const parameters = new HttpParams().set('id_card', idCard)
    .append('type_card', typeCard).append('id', userId);
    return this.http.get(this.urlEndPoint + '/idcard',
      { headers: this.httpHeaders, params: parameters });
  }

  // FGS 26/12/19. Método para comprobar la existencia de un número de la SS.
  public isSSNumberRegistered(ssNumber: string, userId: any) {
    const parameters = new HttpParams().set('ss_number', ssNumber).append('id', userId);
    return this.http.get(this.urlEndPoint + '/ssnumber',
      { headers: this.httpHeaders, params: parameters });
  }

  // FGS 26/12/19. Método para comprobar la existencia de un iban.
  public isIbanNumberRegistered(ibanNumber: string, userId: any) {
    const parameters = new HttpParams().set('iban_number', ibanNumber).append('id', userId);
    return this.http.get(this.urlEndPoint + '/ibannumber',
      { headers: this.httpHeaders, params: parameters });
  }

  // FGS 23/12/19. Método para comprobar la validez de un iban.
  public isValidIbanNumber(ibanNumber: string) {
    const parameters = new HttpParams().set('iban_number', ibanNumber);
    return this.http.get(this.urlEndPoint + '/ibanvalid',
      { headers: this.httpHeaders, params: parameters });
  }

  // FGS 09/01/2020. Método que comprueba si un usuario tiene alguna nómina disponible
  public hasPayrollToShow(userId: any) {
    const parameters = new HttpParams().set('id', userId);
    return this.http.get(this.urlEndPoint + '/haspayroll',
          { headers: this.httpHeaders, params: parameters });
  }
}
