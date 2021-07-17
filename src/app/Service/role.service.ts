import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';


import {Router} from '@angular/router';
import { AuthService } from './auth.service';
import { UserData } from '../Model/userData';
import {TranslateService} from '@ngx-translate/core';
import { Role } from '../Model/role';
import { Permission } from '../Model/permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/roles';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json;charset = utf-8' });

  constructor(private http: HttpClient, private router: Router,
              private authService: AuthService,
              private translate: TranslateService) {
                // FGS 29/11/19. Para mensajes en ficheros externos
                // translate.setTranslation('es', defaultLanguage);
                // translate.setDefaultLang('es');
              }


  private addAuthorizationHeader() {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNotAuthorized(e): boolean {
    if (e.status === 401) {
      // Para comprobar si el token expiro en el backend y si es asi cerrar la sesion del front
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status === 403) {
      // Este error se produce cuando se intenta borrar un rol con un usuario que lo tiene como único rol.
      swal.fire(this.translate.instant('role.service.accessDeniedTitle'),
             e.error.message , 'warning');
      this.router.navigate(['manolito/roles/listar/pagina/0']);
      return true;
    }
    return false;
  }
  useFilters(page: number, ordenationBy: string, order: any, das: string, name: string, surname1: string): Observable<Role> {
    if (ordenationBy === undefined) {
      ordenationBy = 'name';
    }
    const parameters = new HttpParams()
    .set('order', order)
    .append('ordenationBy', ordenationBy)
    .append('dasId', das)
    .append('nameUser', name)
    .append('surname1', surname1);
    return this.http.get(this.urlEndPoint + '/listar/pagina/' + page, {headers: this.httpHeaders, params: parameters}).pipe(
      map((response: any) => {
        (response.content as Role[]).map(role => {
          return role;
        });
        return response;
      }));
  }
  // Método que recupera todos los roles existentes en la BD.
  _getRoles(): Observable<Role[]> {

    return this.http.get(this.urlEndPoint + '/listar', {headers: this.addAuthorizationHeader()}).pipe(
      map( response => {

        const roles = response as Role[];

        return roles.map(role => {
          return role;
        });
      })
    );
  }
  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.urlEndPoint}/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }
        this.router.navigate(['manolito/roles/listar/pagina/0']);
        swal.fire(this.translate.instant('role.service.getRoleErrorTitle'), e.error.message, 'error');
        return throwError(e);
      })
    );
  }
  /**
   * Este método recupera la lista de usuarios asociados a un rol
   * cuyo id se pasa como parámetro.
   * @param id Identificador del rol.
   */
  getUsersDataRole(id: number): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.urlEndPoint}/ver/${id}`, {headers: this.addAuthorizationHeader()});
  }
  create(role: Role): Observable<Role> {
    return this.http.post(this.urlEndPoint + '/crear', role, {headers: this.addAuthorizationHeader()}).pipe(
      map((response: any) => response.role as Role),
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }

        if (e.status === 400) {
          swal.fire(e.error.message, e.error.error, 'error');
          return throwError(e);
        }
        swal.fire(e.error.message, this.translate.instant('role.service.createRoleErrorMsg'), 'error');
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  update(role: Role): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/modificar/${role.id}`, role, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }

        if (e.status === 400) {
          // FGS 29/11/19 Para recuperar y mostrar los errores.
          const arrayErrors: string[] = e.error.errors;
          let error = '';
          if (arrayErrors != null) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < arrayErrors.length; i++) {
              error = error + '<br>' + arrayErrors[i];
            }
          }
          swal.fire(e.error.message, error, 'error');
          // swal.fire("Error al modificar rol", "Contacte con le soporte.", 'error');

          return throwError(e);
        }
        swal.fire(this.translate.instant('role.service.modifyRoleErrorTitle'),
        this.translate.instant('role.service.contactSupportErrorMsg'), 'error');
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  // Método para borrar un rol pasándole su id.
  delete(id: number): Observable<Role> {
    return this.http.delete<Role>(`${this.urlEndPoint}/listar/${id}`, {headers: this.addAuthorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNotAuthorized(e)) {
          return throwError(e);
        }
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        swal.fire(this.translate.instant('role.service.deleteRoleErrorTitle'),
          // this.translate.instant('role.service.contactSupportErrorMsg'), 'error');
          e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  // Método para recuperar todos los permisos de la BD.
  getPermissions(): Observable<Permission[]> {

    return this.http.get(this.urlEndPoint + '/permisos/listar', {headers: this.addAuthorizationHeader()}).pipe(
      map( response => {

        const permissions = response as Permission[];

        return permissions.map(permission => {
          return permission;
        });
      })
    );
  }

  // FGS 16/12/19. Método para comprobar la existencia de un nombre de rol en la BD.
  public isRoleNameRegistered(roleName: string) {
    return this.http.get(`${this.urlEndPoint}/name/${roleName}`);
  }
  public isRoleNameRegisteredV2(roleName: string, roleId: any) {
    const parameters = new HttpParams().set('id', roleId);
    return this.http.get(`${this.urlEndPoint}/name/${roleName}`, {headers: this.httpHeaders, params: parameters});
  }
}
