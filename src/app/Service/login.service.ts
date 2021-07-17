import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) { }

  private addAuthorizationHeader() {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

   public updateAttempts(dasId: string): Observable<any> {
     return this.http.get<any>(this.urlEndPoint + '/login/' + dasId, {headers: this.addAuthorizationHeader()});
  }

  public resetNum(id: number): Observable<any> {
    return this.http.get<any>(this.urlEndPoint + '/login/reset/' + id, {headers: this.addAuthorizationHeader()});
  }

  public findDasLogin(das: string) {
    return this.http.get<any>(this.urlEndPoint + '/login/find/' + das, {headers: this.addAuthorizationHeader()});
  }


}
