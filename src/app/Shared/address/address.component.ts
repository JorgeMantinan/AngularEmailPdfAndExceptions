import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { Community } from '../../Model/community';
import { Province } from '../../Model/province';
import { Township } from '../../Model/township';
import { Postalcode } from '../../Model/postalcode';
import { AddressService } from '../../Service/address.service';
import Swal from 'sweetalert2';
import { Address } from 'src/app/Model/address';
import { TranslateService } from '@ngx-translate/core';

// dtg005-DCS-26/11/2019
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit, AfterContentChecked {

  public listTypeStreet = ['Calle', 'Travesía', 'Avenida', 'Polígono', 'Kalea'];
  public text = 'Añadir direccion';
  listCommunity: Array<Community> = null;
  listProvince: Array<Province> = null;
  listTownShip: Array<Township> =  null;
  listPostalCode: Array<Postalcode> = null;
  @Input() public listAddress: Array<Address> = new Array<Address>();
  public selectedTypeStreet: number;
  public postalcodeSelected: number;
  public portalSelected: number;
  public floorSelected: string;
  public doorSelected: string;
  public addressNameSelected: string;

  constructor(private addressService: AddressService, private translate: TranslateService) { }

  // carga de las comunidades al iniciar el component
  ngOnInit() {
    this.addressService.findAllCommunity().subscribe(
      communities => { this.listCommunity = communities; }
    );
    this.selectedTypeStreet = 1;
  }

  ngAfterContentChecked() {
    if (this.selectedTypeStreet === undefined || this.selectStreetType === null) {
      this.selectedTypeStreet = 1;
    }
  }

  // Metodo que actualiza los campo en relacion a la comunidad seleccionada
  updateCommunity(community) {
    this.addressService._findAllProvince(community).subscribe(
      provinces => { this.listProvince = provinces; }
    );
    if ( this.listPostalCode !== null) {
      this.removeList(this.listPostalCode);
      }
    if ( this.listTownShip !== null) {
      this.removeList(this.listTownShip);
      }
  }

  // Metodo que actualiza los campos en relación a la provincia seleccionada
  updateProvince(province) {
    this.addressService._findAllTownShip(province).subscribe(
      township => { this.listTownShip = township; }
    );
    if ( this.listPostalCode !== null) {
      this.removeList(this.listPostalCode);
    }
  }

  // Metodo que actualiza los campos en relacion al municipio
  updateTownShip(township, province) {
    this.addressService._findAllPostalCode(township, province).subscribe(
      postalcode => {this.listPostalCode = postalcode; }
    );
  }

  create() {
    const address: Address = new Address();
    address.addressName = this.addressNameSelected;
    if (this.floorSelected === undefined) {
      this.floorSelected = null;
      }
    address.floor = this.floorSelected;
    if (this.portalSelected === undefined) {
      this.portalSelected = null;
      }
    address.portal = this.portalSelected;
    if (this.doorSelected === undefined) {
      this.doorSelected = null;
      }
    address.door = this.doorSelected;
    address.streetType = this.selectedTypeStreet;
    this.addressService.findPostalCode(this.postalcodeSelected).subscribe(
      postalcode => {address.postalCode = postalcode;
                     let valid = true;
                     const text = address.addressName +
                                address.streetType +
                                address.portal +
                                address.floor +
                                address.door +
                                address.postalCode;
                     for (const addresses of this.listAddress) {
                      const textaddresses = addresses.addressName +
                                addresses.streetType +
                                addresses.portal +
                                addresses.floor +
                                addresses.door +
                                addresses.postalCode;
                      if (textaddresses === text) {
                          valid = false;
                          break;
                      }
                    }
                     if (valid) {
                      this.listAddress.push(address);
                      document.getElementById('cleanAddress').click();
                    } else {
                      Swal.fire(this.translate.instant('address.existingAddress'), '', 'info');
                    } }
    );
  }

  // Metodo que limpia los campos de creación de direccion
  clean() {
    if ( this.listPostalCode !== null) {
    this.removeList(this.listPostalCode);
    }
    if ( this.listTownShip !== null) {
    this.removeList(this.listTownShip);
    }
    if ( this.listProvince !== null) {
    this.removeList(this.listProvince);
    }
    if ( this.listCommunity !== null) {
      this.removeList(this.listCommunity);
    }
    this.ngOnInit();
  }
  // Metodo que limpia las listas de los combons
  removeList(list) {
      list.splice(0, list.length);
  }

  // Metodo que cambia el texto del boton
  changeText(text) {
    if (text === this.translate.instant('address.addAddress')) {
      this.text = this.translate.instant('address.closeAddress');
    } else {
      this.text = this.translate.instant('address.addAddress');
      document.getElementById('cleanAddress').click();
    }
  }

  delete(i) {
  this.listAddress.splice(i, 1);
  }

  selectStreetType(): void {
    document.getElementById('typeCalle').click();
  }
}
