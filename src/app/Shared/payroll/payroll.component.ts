import { Component, OnInit, Input } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { Specialconditions } from '../../Model/specialconditions';
import { UserDataExtended } from 'src/app/Model/userDataExtended';
import { PayrollconfigurationService } from 'src/app/Service/payrollconfiguration.service';



@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html'
})
export class PayrollComponent implements OnInit {


  constructor( private datePipe: DatePipe,
               private payrollconfigurationService: PayrollconfigurationService) {}

  salarys = [
    10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
    20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000,
    30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000,
    40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 49000,
    50000, 51000, 52000, 53000, 54000, 55000, 56000, 57000, 58000, 59000,
    60000, 61000, 62000, 63000, 64000, 65000, 66000, 67000, 68000, 69000,
    70000, 71000, 72000, 73000, 74000, 75000, 76000, 77000, 78000, 79000,
    80000, 81000, 82000, 83000, 84000, 85000, 86000, 87000, 88000, 89000,
    90000, 91000, 92000, 93000, 94000, 95000, 96000, 97000, 98000, 99000,
    100000
  ];
  @Input() userDE: UserDataExtended = new UserDataExtended();
  @Input() create: boolean;
  @Input() userRRHH: boolean; // variable para saber si entra un usuario normal a crear/modificar sus datos o uno de recursos humanos;
  hireDateStr: string;
  fireDateStr: string;
  salary: number;
  Conditions: Specialconditions[];
  router = 'usuarios/specialConditions';

  dateFilter = date => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  }

  ngOnInit() {
    this.payrollconfigurationService.getSpecialConditions().subscribe(response => {
      this.Conditions = response;
    });

    if (this.userDE.hiredDate !== null && this.userDE.hiredDate !== undefined) {
    this.hireDateStr = this.datePipe.transform(this.userDE.hiredDate, 'dd-MM-yyyy');
    // const fecha = new Date(+'2018', +'12', +'12'); simbolo '+' delante de un string para pasar a numero
    this.userDE.hiredDate =
      new Date(+this.hireDateStr.substr(6, 4), +this.hireDateStr.substr(3, 2) - 1, +this.hireDateStr.substr(0, 2));
    } else {
      this.create = true;
    }
    if (this.userDE.firedDate !== null && this.userDE.firedDate !== undefined) {
    this.fireDateStr = this.datePipe.transform(this.userDE.firedDate, 'dd-MM-yyyy');
    this.userDE.firedDate =
      new Date(+this.fireDateStr.substr(6, 4), +this.fireDateStr.substr(3, 2) - 1, +this.fireDateStr.substr(0, 2));
    }
  }

}
