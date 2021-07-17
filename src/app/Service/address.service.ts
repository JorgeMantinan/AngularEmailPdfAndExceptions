import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Address } from '../Model/address';
import { Community } from '../Model/community';
import { Province } from '../Model/province';
import { Township } from '../Model/township';
import { Postalcode } from '../Model/postalcode';

@Injectable({
  providedIn: 'root'
})
// dtg005-DCS-26/11/2019
export class AddressService {

  private urlEndPoint = 'http://10.0.0.105:8080/manolito/direccion';

constructor(private http: HttpClient) { }

save(address: Address): Observable<Address> {
  return this.http.post(this.urlEndPoint + '/crear', address).pipe(
    map((response: any) =>  response.address as Address),
    catchError(e => {
      return throwError(e);
    })
  );
}


// Metodo que llama al back para devolver todas las comunidades
  findAllCommunity(): Observable<Community[]> {
    return this.http.get(this.urlEndPoint + '/comunidad').pipe(
      map(response => {
        const communities = response as Community[];
        return communities.map(community => {
          return community;
        });
      })
    );
  }

// Metodo que llama al back para devolver la comunidad indicado por el id
  findCommunity(communityId: number): Observable<Community> {
    return this.http.get(this.urlEndPoint + '/communidad/' + communityId).pipe(
      map(response => {
        const community = response as Community;
        return community;
      })
    );
  }

  // Metodo que llama al back para devolver todas las provincias
  findAllProvince(): Observable<Province[]> {
    return this.http.get(this.urlEndPoint + '/provincias').pipe(
      map(response => {
        const provinces = response as Province[];
        return provinces.map(province => {
          return province;
        });
      })
    );
  }
  // Metodo que llama al back para devolver la lista de provincias de la comunidad indicada
  _findAllProvince(communityId: number): Observable<Province[]> {
    return this.http.get(this.urlEndPoint + '/provincias/' + communityId).pipe(
      map(response => {
        const provinces = response as Province[];
        return provinces.map(province => {
          return province;
        });
      })
    );
  }

  // Metodo que devulve la comunidad indicada como parámetro
  findProvince(provinceId: number): Observable<Province> {
    return this.http.get(this.urlEndPoint + '/provincia/' + provinceId).pipe(
      map(response => {
        const province = response as Province;
        return province;
      })
    );
  }

  // Metodo que devuleve los munidicpios de la provincia
  _findAllTownShip(provinceId: number): Observable<Township[]> {
    return this.http.get(this.urlEndPoint + '/municipio/' + provinceId).pipe(
      map(response => {
        const township = response as Township[];
        return township;
      })
    );
  }

  // Metodo que devuelve todos los codigos postales del municipio seleccionado
  _findAllPostalCode(townshipId: number, provinceId: number): Observable<Postalcode[]> {
    return this.http.get(this.urlEndPoint + '/cp/' + townshipId + '/' + provinceId).pipe(
      map(response => {
        const postalcode = response as Postalcode[];
        return postalcode;
      })
    );
  }

  // Metodo que devuleve el objeto codigo postal entero
  findPostalCode(cp: number): Observable<Postalcode> {
    return this.http.get(this.urlEndPoint + '/cp/' + cp).pipe(
      map(response => {
        const postalcode = response as Postalcode;
        return postalcode;
      })
    );
  }
}
