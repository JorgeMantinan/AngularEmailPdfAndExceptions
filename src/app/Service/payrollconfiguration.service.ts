import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Payrollconfiguration } from '../Model/payrollconfiguration';
import { map, catchError } from 'rxjs/operators';
import { Specialconditions } from '../Model/specialconditions';

@Injectable({
  providedIn: 'root'
})
export class PayrollconfigurationService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/usuarios/';
  // private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json;charset = utf-8' });

  constructor(private http: HttpClient) { }

  getConfiguration(): Observable<Payrollconfiguration[]> {
    return this.http.get(this.urlEndPoint + 'payroll').pipe(
      map(response => {
        const payrollconfigurations = response as Payrollconfiguration[];
        return payrollconfigurations;
      })
    );
  }

  saveConfiguration(payrollConfig: Payrollconfiguration[]): Observable<Payrollconfiguration[]> {
    return this.http.put(this.urlEndPoint + 'payroll/save', payrollConfig).pipe(
      map((response: any) => response.payroll as Payrollconfiguration[]),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getSpecialConditions(): Observable<Specialconditions[]> {
    return this.http.get(this.urlEndPoint + 'specialConditions').pipe(
      map(response => {
        const specialconditions = response as Specialconditions[];
        return specialconditions;
      })
    );
  }
}

