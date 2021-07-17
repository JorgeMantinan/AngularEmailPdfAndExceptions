import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PayrollsService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/usuarios';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private translate: TranslateService) { }


  /**
   * Obtiene mes y año de todas las nóminas de un usuario
   * @author JMM
   * @since  03/01/2020
   */
  getPayrollsDates(id: any): Observable<string[]> {
    return this.http.get<string[]>(`${this.urlEndPoint}/payrollslist/${id}`);
  }


  /**
   * Envía el mes y año al back para generar las nóminas de dichos meses
   * @author JMM
   * @since  03/01/2020
   */
  sendPayrollsDates(id: any, listPayrollsDates: string[]) {
    const parameters = new HttpParams()
    .set('user_id', id);
    return this.http.post<string[]>(`${this.urlEndPoint}/datosextendidos/nominas/descarga/variosmeses`, listPayrollsDates,
                                    {headers: this.httpHeaders, params: parameters}).pipe(
      map((response: any) => {
        Swal.fire('', response.message,
            'success');
      }),
      catchError(e => {
        if (e.status) {
          Swal.fire(this.translate.instant('userDataExtended.payroll.downloadPayrollsErrMsg'),
          this.translate.instant('userDataExtended.payroll.contactSupportErrorMsg') , 'error');
        }
        return throwError(e);
      })
    );
  }


}
