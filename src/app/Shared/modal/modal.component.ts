import { Component, OnInit, Input } from '@angular/core';
import { Role } from '../../Model/role';
import { Address } from '../../Model/address';
import { PayrollconfigurationService } from '../../Service/payrollconfiguration.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Payrollconfiguration } from '../../Model/payrollconfiguration';
import { Permission } from 'src/app/Model/permission';
import { UsersDataExtendedComponent } from 'src/app/Controllers/usersDataExtended.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private payrollservice: PayrollconfigurationService,
              private translate: TranslateService,
              private useDE: UsersDataExtendedComponent) { }

  public listTypeStreet = ['Calle', 'Travesía', 'Avenida', 'Polígono', 'Kalea'];
  @Input() public numList = 4;
  @Input() public list: Array<any>;
  listConfiguration: Array<Payrollconfiguration>;
  config: any;


  ngOnInit() {
      this.isConfiguration();
  }

  convertList(list: Array<any>) {
    switch (this.numList) {
      case 1: // la lista es de permisos
        return list as Permission[];
      case 2: // la lista es de roles
        return list as Role[];
      case 3: // la lista es de direcciones
        return list as Address[];
    }
  }

  isConfiguration() {
    this.payrollservice.getConfiguration().subscribe(
      response => {
        this.listConfiguration = response;
      });
  }

  saveConfig() {
    // tslint:disable-next-line: radix
    if ( parseInt( this.listConfiguration[0].value) > 28 || parseInt(this.listConfiguration[0].value) < 1 ) {
      Swal.fire(this.translate.instant('userDataExtended.payrollConfig.permittedValueBetween'), '', 'info');
    } else {
      this.payrollservice.saveConfiguration(this.listConfiguration).subscribe();
      this.useDE.ngOnInit();
    }
  }

}
