import { Component, OnInit, Input } from '@angular/core';
import { UsersDataComponent } from '../../Controllers/usersData.component';
import { RolesComponent } from '../../Controllers/roles.component';
import { UsersDataExtendedComponent } from '../../Controllers/usersDataExtended.component';


@Component({
  selector: 'app-filtros',
  templateUrl: './filters.component.html'})
export class FiltersComponent implements OnInit {
  @Input() public vista: number;
  @Input() public route: string;
  das: string;
  name: string;
  surname1: string;
  surname2: string;
  mail: string;
  state: number;
  nie: string;
  nif: string;
  passport: string;
  ssNumber: string;


  constructor(private userData: UsersDataComponent,
              private userDataExtended: UsersDataExtendedComponent,
              private role: RolesComponent) {
                 // FGS 03/12/19. Para mensajes en ficheros externos
              }

  ngOnInit() {
    /*
    1- Usuarios
    2- Roles
    3- Daots extendidos
    */
  }

  filter(): void {
    if (this.das === undefined || this.das === null) {
      this.das = '';
    }
    if (this.name === undefined || this.name === null) {
      this.name = '';
    }
    if (this.surname1 === undefined || this.surname1 === null) {
      this.surname1 = '';
    }
    switch (this.vista) {
      case 1:
          if (this.surname2 === undefined || this.surname2 === null) {
            this.surname2 = '';
          }
          if (this.mail === undefined || this.mail === null) {
            this.mail = '';
          }
          if (this.state === undefined || this.state === null) {
            this.state = 0;
          }
          this.userData.applyFilters(this.das, this.name, this.surname1, this.surname2, this.mail, this.state);
          break;
      case 2:
          this.role.applyFilters(this.das, this.name, this.surname1);
          break;
      case 3:
          if (this.nie === undefined || this.nie === null) {
            this.nie = '';
          }
          if (this.nif === undefined || this.nif === null) {
            this.nif = '';
          }
          if (this.passport === undefined || this.passport === null) {
            this.passport = '';
          }
          if (this.ssNumber === undefined || this.ssNumber === null) {
            this.ssNumber = '';
          }
          this.userDataExtended.applyFilters(this.das, this.name, this.surname1, this.nie, this.nif, this.passport, this.ssNumber);
          break;
    }
  }

  delete(): void {
    switch (this.vista) {
      case 1:
        this.userData.das = '';
        this.userData.name = '';
        this.userData.surname1 = '';
        this.userData.surname2 = '';
        this.userData.mail =  '';
        this.userData.state = 0;
        this.userData.ngOnInit();
        break;
      case 2:
        this.role.das = '';
        this.role.name = '';
        this.role.surname1 = '';
        this.role.ngOnInit();
        break;
        case 3:
        this.userDataExtended.das = '';
        this.userDataExtended.name = '';
        this.userDataExtended.surname1 = '';
        this.userDataExtended.nie = '';
        this.userDataExtended.nif = '';
        this.userDataExtended.passport = '';
        this.userDataExtended.ssNumber = '';
        this.userDataExtended.ngOnInit();
        break;
    }
  }

}
