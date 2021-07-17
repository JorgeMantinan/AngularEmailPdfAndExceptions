import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from 'src/app/Service/userData.service';
import { RoleService } from '../../Service/role.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dualList',
  templateUrl: './dualList.component.html',
  styleUrls: ['./dualList.component.css']
})
export class DualListComponent implements OnInit {
  @Input() public numList: number;
  listData: any[] = [];
  @Input() public listAssign: any[] = [];
  auxAdd: any[] = [];
  auxRem: any[] = [];
  listValid: boolean;

  constructor(
    private userDataService: UserDataService,
    private roleService: RoleService
  ) {
    this.listValid = this.isValid(this.listAssign);
   }

  ngOnInit() {
    // DCS carga de listas según el que se quiera listar 1 = Usuarios, 2 = Permisos, 3 = Roles
    switch (this.numList) {
      case 1:
        this.userDataService
          ._getUsersData()
          .subscribe(usersData => { this.listData = usersData;
                                    this.removeDuplicate(this.listData, this.listAssign);
                                    this.listValid = this.isValid(this.listAssign); });
        break;
      case 2:
        this.roleService
          .getPermissions()
          .subscribe(permissions => { this.listData = permissions;
                                      this.removeDuplicate(this.listData, this.listAssign);
                                      this.listValid = this.isValid(this.listAssign); });
        break;
      case 3:
        this.roleService
          ._getRoles()
          .subscribe(roles => {this.listData = roles;
                               this.removeDuplicate(this.listData, this.listAssign);
                               this.listValid = this.isValid(this.listAssign); });
        break;
    }
  }
  // Eliminar la duplicidad de la primera lista ( se eliminan todo los elementos que se encuentren en la segunda lista)
  removeDuplicate(list1: Array<any>, list2: Array<any>) {
    for (let i = 0, len = list2.length; len > i; i++) {
      for (let j = 0, leng = list1.length; leng > j; j++) {
        if (list2[i].id === list1[j].id) {
          list1.splice(j, 1);
          break;
        }
      }
    }
  }

  // Metodo que se utiliza para seleccionar o des-seleccionar el elemento de la lista sobre el que se hace click
  selectItem(list: Array<any>, item: any) {
    if (list.includes(item)) {
      // si el elemento esta en la lista se busca y elimina de la misma
      for (let i = 0, len = list.length; i < len; i += 1) {
        if (list[i] === item) {
          // splice con dos argumentos elimina desde la posicion del primer paramentro, tantos elementos como el valor del segundo
          list.splice(i, 1);
        }
      }
    } else {
      // añadir el elemento a la lista
      list.push(item);
    }
  }

  // Metodo que se utiliza para añador elementos o eliminarlos
  // aux -> array auxiliar que contiene los elementos que se van a mover
  // list -> array que recive los elementos de la lista auxiliar
  // listDel -> array que del que se eliminan los elementos de la lista auxiliar
  moveItem(aux: Array<any>, list: Array<any>, listDel: Array<any>) {
    for (let i = 0, len = aux.length; i < len; i += 1) {
      list.push(aux[i]);
    }
    for (let i = 0, len = aux.length; i < len; i += 1) {
      for (let j = 0, leng = listDel.length; j < leng; j += 1) {
        if (aux[i] === listDel[j]) {
          listDel.splice(j, 1);
        }
      }
    }
    this.removeList(aux);
    this.listValid = this.isValid(this.listAssign);
  }
  // Seleccionar todos los elementos de la lista y cargarlos en la lista auxiliar
  selectAll(list: Array<any>, aux: Array<any>) {
    for (let i = 0, len = list.length; i < len; i += 1) {
      if (!aux.includes(list[i])) {
        aux.push(list[i]);
        this.isItemSelected(list[i], list);
      }
    }
  }

  // Des-seleccionar todos los elementos de la lista y eliminar todos los elementos de la lista auxiliar
  unselectAll(list: Array<any>, aux: Array<any>) {
    for (let i = 0, len = list.length; i < len; i += 1) {
      this.isItemSelected(list[i], list);
    }
    this.removeList(aux);
  }

  // Eliminar todos los elementos de la lista que se le manda por parametro
  removeList(aux: Array<any>) {
    for (let i = 0, len = aux.length; i < len; i += 1) {
      aux.pop();
    }
  }

  // Aplicar filtros a las listas presentadas
  onFilter(filter: string, listCompare: Array<any>) {
    filter = filter.toUpperCase();
    if (filter.length === 0) {
      switch (this.numList) {
        case 1:
          this.userDataService
            ._getUsersData()
            .subscribe(usersData => (this.listData = usersData));
          break;
        case 2:
          this.roleService
            .getPermissions()
            .subscribe(permissions => (this.listData = permissions));
          break;
        case 3:
          this.roleService
            ._getRoles()
            .subscribe(roles => (this.listData = roles));
          break;
      }
    } else {
      switch (this.numList) {
        case 1:
          this.userDataService
            ._getUsersData()
            .subscribe(usersData => (this.listData = usersData.filter(userData => userData.name.includes(filter))));
          break;
        case 2:
          this.roleService
            .getPermissions()
            .subscribe(permissions => (this.listData = permissions.filter(permission => permission.name.includes(filter))));
          break;
        case 3:
          this.roleService
            ._getRoles()
            .subscribe(roles => (this.listData = roles.filter(role => role.name.includes(filter))));
          break;
      }
    }
  }

  // Indicar si el elmento no esta selecionado, que se seleccione / y viceversa)
  isItemSelected(item: any, list: Array<any>): boolean {
    if (list.includes(item)) {
      return true;
    } else {
      return false;
    }
 }
 //  Metodo que se utiliza para controloar las listas obligatorias al crear o modificar
 isValid(list: Array<any>): boolean {
  if (list.length < 1 ) {
    return false;
  } else {
    return true;
  }
 }
}
