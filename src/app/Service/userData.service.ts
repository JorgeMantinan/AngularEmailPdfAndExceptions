import { Injectable } from '@angular/core';
import { UserData } from '../Model/userData';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/usuarios';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router,
              private authService: AuthService,
              private translate: TranslateService) {
                 // FGS 03/12/19. Para mensajes en ficheros externos
              }


  private addAuthorizationHeader() {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  getUsersData(page: number, ordenationBy: string, order: any): Observable<UserData[]> {
    if (ordenationBy === undefined) {
      ordenationBy = 'dasId';
    }
    const parameters = new HttpParams().set('order', order).append('ordenationBy', ordenationBy);
    return this.http.get(this.urlEndPoint + '/listar/pagina/' + page, {headers: this.httpHeaders, params: parameters}).pipe(
      map((response: any) => {
        (response.content as UserData[]).map(userData => {
          return userData;
        });
        return response;
      }));
  }

  _getUsersData(): Observable<UserData[]> {
    return this.http.get(this.urlEndPoint + '/listar').pipe(
      map((response: any) => {
        (response as UserData[]).map(userData => {
          return userData;
        });
        return response;
      }));
  }
  // FGS 15/11/19
  getUsersWithoutDataExtended(): Observable<UserData[]> {
    return this.http.get(this.urlEndPoint + '/listar/usuariosSinDatosExtendidos').pipe(
      map((response: any) => {
        (response as UserData[]).map(userData => {
          return userData;
        });
        return response;
      }));
  }
  create(userData: UserData): Observable<UserData> {
    return this.http.post(this.urlEndPoint + '/crear', userData).pipe(
      map((response: any) => response.userData as UserData),
      catchError(e => {
        const arrayErrors: string[] = e.error.errors;
        let error = '';
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arrayErrors.length; i++) {
          error = error + '<br>' + arrayErrors[i];
        }

        if (e.status === 400) {
          swal.fire(e.error.message, error, 'error');
          return throwError(e);
        }

        swal.fire(e.error.message, this.translate.instant('userData.service.userCreateErrMsg'), 'error');
        return throwError(e);
      })
    );
  }

  getUserData(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.status !== 404 && e.error.message) {
          swal.fire('Error al obtener el usuario', e.error.message, 'error');
          this.router.navigate(['manolito/usuarios/listar/pagina/0']);
        } else if (e.status === 404) {
          swal.fire('No se ha encontrado el usuario', e.error.message, 'error');
          this.router.navigate(['manolito/usuarios/listar/pagina/0']);
        }
        return throwError(e);
      })
    );
  }

  updatePassword(dasId: string, password: string): Observable<UserData> {
    return this.http.put<UserData>('http://10.0.0.105:8080/manolito/activar/' + dasId + '/' + password,
    {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  update(userData: UserData): Observable<UserData> {
    return this.http.put<any>('http://10.0.0.105:8080/manolito/usuarios/modificar/' + userData.id, userData).pipe(
      map((response: any) => response.userData as UserData),
      catchError(e => {
        const arrayErrors: string[] = e.error.errors;
        let error = '';
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arrayErrors.length; i++) {
          error = error + '<br>' + arrayErrors[i];
        }
        if (e.status === 102) { // El servidor backend está caído.
          return throwError(e);
        }
        if (e.status === 400) {
          swal.fire(e.error.message, error, 'error');
          return throwError(e);
        }
        swal.fire(this.translate.instant('userData.service.userModifyErrTitle'),
                  this.translate.instant('userData.service.userModifyUnspecificErrMsg'),
                  'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<UserData> {
    return this.http.delete<UserData>(`${this.urlEndPoint}/listar/${id}`).pipe(
      catchError(e => {
        swal.fire(e.error.message, e.error.errors, 'error');
        return throwError(e);
      })
    );
  }

  // FGS 20/12/19. Método para comprobar la existencia de un DAS ID en la BD pasando el id.
  public isDasRegistered(dasId: string, id: any) {
    const parameters = new HttpParams().set('id', id);
    return this.http.get(`${this.urlEndPoint}/das/${dasId}`, {headers: this.httpHeaders, params: parameters});
  }
  useFilters(page: number, ordenationBy: string, order: any, dasId: string, name: string, surname1: string,
             surname2: string, mail: string, state: any): Observable<UserData[]> {
    if (ordenationBy === undefined) {
      ordenationBy = 'dasId';
    }
    const parameters = new HttpParams()
    .set('order', order)
    .append('ordenationBy', ordenationBy)
    .append('dasId', dasId)
    .append('name', name)
    .append('surname1', surname1)
    .append('surname2', surname2)
    .append('mail', mail)
    .append('state', state);
    return this.http.get(this.urlEndPoint + '/listar/pagina/' + page, {headers: this.httpHeaders, params: parameters}).pipe(
      map((response: any) => {
        (response.content as UserData[]).map(userData => {
          return userData;
        });
        return response;
      }));
  }

}
