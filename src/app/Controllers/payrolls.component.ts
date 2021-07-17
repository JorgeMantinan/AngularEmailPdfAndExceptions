import { AuthService } from '../Service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PayrollDate } from '../Model/payrollDate';
import { UserDataExtended } from '../Model/userDataExtended';
import { UsersDataExtendedService } from '../Service/usersDataExtended.service';
import Swal from 'sweetalert2';
import { PayrollsService } from '../Service/payrolls.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payrolls',
  templateUrl: '../View/payrolls.component.html'
})

// T3019-JMM-02/01/20
export class PayrollsComponent implements OnInit {

  checked = false;
  listPayrollDate: string[];
  listUserPayrollDownload: string[];
  idToSend: number;
  payrollDate: PayrollDate[] = [];
  userDataExtended: UserDataExtended;

  constructor(private udeService: UsersDataExtendedService, private payrollsService: PayrollsService,
              private authService: AuthService, private activatedRoute: ActivatedRoute, private translate: TranslateService) {
  }


  ngOnInit() {
    this.loadPayrollDates();
  }

  /**
   * Recibe las fechas de las nóminas del usuario seleccionado
   * @author JMM
   * @since  07/01/2020
   */
loadPayrollDates(): void {
  this.activatedRoute.params.subscribe(params => {
    let id = params[`id`];
    this.udeService.getUserDataExtended(id).subscribe(user => {
      this.userDataExtended = user;
    });
    // Si no tiene permiso para ver las nóminas de otros usuarios, dirige a sus nóminas
    if (!this.authService.hasPermissions(['ROLE_VER NOMINAS'])) {
      id = this.authService.login.id;
    }
    if (id) {
      this.idToSend = id;
      this.payrollsService.getPayrollsDates(id).subscribe(response => {
        for (const yearMonth of response) {
          const payroll = new PayrollDate();
          payroll.yearMonth = yearMonth;
          this.payrollDate.push(payroll);
        }
        this.listPayrollDate = response;
      });
    }
  });
}


add(payrollDate: PayrollDate) {
  if (!payrollDate.checked || payrollDate.checked === undefined) {
    payrollDate.checked = true;
  } else {
    payrollDate.checked = false;
  }
}

download() {
  this.listUserPayrollDownload = [];
  for (const payrollDate of this.payrollDate) {
    if (payrollDate.checked === true) {
      this.listUserPayrollDownload.push(payrollDate.yearMonth);
    }
  }
  if (this.listUserPayrollDownload.length !== 0) {
  this.payrollsService.sendPayrollsDates(this.idToSend, this.listUserPayrollDownload).subscribe();
  } else {
    Swal.fire(this.translate.instant('userDataExtended.payroll.unselectedPayrolls'),
      this.translate.instant('userDataExtended.payroll.selectPayrollsToDownload') , 'info');
  }
}

  /**
   * Comprueba si tiene el permiso ROLE_DESCARGAR NOMINAS para pintar o no el checkbox a seleccionar
   * @author JMM
   * @since 09/01/2020
   * @branch T3025
   *
   */
  checkedDowloadPayroll(): boolean {
      if (this.authService.login.id !== this.idToSend &&
        !this.authService.hasPermissions(['ROLE_DESCARGAR NOMINAS'])) {
          return false;
        }
      return true;
  }

  emptyPayrolls(): boolean {
    if (this.payrollDate.length === 0) {
      return true;
    } else {
      return false;
    }
  }

}
