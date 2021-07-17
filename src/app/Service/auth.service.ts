import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../Model/login';
import { UserData } from '../Model/userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  private _userData: UserData;
  // tslint:disable-next-line: variable-name
  private _login: Login;
  // tslint:disable-next-line: variable-name
  private _token: string;

  constructor(private http: HttpClient) { }

  // Tiene que ir el mismo nombre que el atributo pero sin "_"
  public get login(): Login {
    if (this._login != null) {
      return this._login;
    } else if (this._login == null && localStorage.getItem('login') != null) {
      this._login = JSON.parse(localStorage.getItem('login')) as Login;
      return this._login;
    }
    return new Login();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem('token') != null) {
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get userData(): UserData {
    if (this._userData != null) {
      return this._userData;
    } else if (this._userData == null && localStorage.getItem('userData') != null) {
      this._userData = JSON.parse(localStorage.getItem('userData')) as UserData;
      return this._userData;
    }
    return new UserData();
  }

  /* Metodo para pasar al backend por post la informacion para logearse con el objeto Login */
  infoLogin(login: Login): Observable<any> {
    /* Apunta al EndPoint de SpringSecurity */
    const urlEndPoint = 'http://10.0.0.105:8080/oauth/token';

    /* btoa para convertir en base64 */
    const credentials = btoa('angularapp' + ':' + '12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credentials
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', login.dasId);
    params.set('password', login.password);

    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  saveLogin(accessToken: string): void {
    const payload = this.getDataToken(accessToken);
    this._login = new Login();

    // dtg003-JMM-05/12/19
    // Se añadió el id para obtener el usuario logueado para permitir ver sus datos,crearlos y modificarlos
    this._login.id = payload.id;
    this._login.dasId = payload.user_name;
    this._login.password = payload.password;
    this._login.permissions = payload.authorities;
    // this._login.roles = payload.authorities;
    this._login.attemptsNum = payload.attemptsNum;
    this._login.state = payload.state;

    // Al ser un objeto hay que pasarlo a string con stringify
    localStorage.setItem('login', JSON.stringify(this._login));
    localStorage.setItem('user', JSON.stringify(this._login));

    this._token = accessToken;
    localStorage.setItem('token', accessToken);
  }

  //Prueba refresh_token
  saveLogin2(accessToken: string): void {
    const payload = this.getDataToken(accessToken);
    this._login = new Login();

    this._login.id = payload.id;
    this._login.dasId = payload.user_name;
    this._login.password = payload.password;
    this._login.permissions = payload.authorities;
    this._login.attemptsNum = payload.attemptsNum;
    this._login.state = payload.state;

    // Al ser un objeto hay que pasarlo a string con stringify
    localStorage.setItem('user', JSON.stringify(this._login));
  }


  saveUsuario(accessToken: string): void {
     const payload = this.getDataToken(accessToken);

     this._userData = new UserData();
     this._userData.id = payload.id;
     this._userData.name = payload.name;
     this._userData.surname1 = payload.surname1;
     this._userData.surname2 = payload.surname2;
     this._userData.email = payload.email;
     this._userData.state = payload.state;
     // this._userData.role = payload.role;
     this._userData.permissions = payload.authorities;
  }

  getDataToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }


  isAuthenticated(): boolean {
    const payload = this.getDataToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._login = null;
    localStorage.clear();
  }

  // T2016 JMM 07/11/2019
  // Se ha cambiado hasRole por hasPermissions
  hasPermissions(permission: string[]): boolean {
    for (let i = 0, len = permission.length; len > i; i++) {
      if (this.login.permissions.includes(permission[i])) {
        return true;
      }
    }

    return false;
  }
}
