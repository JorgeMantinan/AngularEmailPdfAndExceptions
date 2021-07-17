import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../../Service/userData.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserData } from '../../Model/userData';
import swal from 'sweetalert2';
import { RoleService } from 'src/app/Service/role.service';
import { DualListComponent } from 'src/app/Shared/dualList/dualList.component';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-modificar',
  templateUrl: '../../View/User/modify.component.html'
})
export class ModifyUsrComponent implements OnInit {

  @ViewChild('Roles', { static: false, read: DualListComponent }) public Roles: DualListComponent;
  public userData: UserData = new UserData();
  public isDasValid = true;
  public initialDas: string;
  public oldId: number;

  errors: string[];
  public stateUserData: number;
  constructor(private userDataService: UserDataService, private roleService: RoleService,
              private router: Router, private activatedRoute: ActivatedRoute,
              private translate: TranslateService) {
    this.loadUserData();
  }

  ngOnInit() {
  }

  loadUserData(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params[`id`];
      if (id) {
        this.userDataService.getUserData(id).subscribe((userData) => {
          this.userData = userData;
          this.stateUserData = this.userData.state;
          this.initialDas = userData.dasId;
          this.oldId = userData.id;
        });
      }
    });
  }
  async loadUserDataAsync() {
    this.activatedRoute.params.subscribe(async params => {
      const id = params[`id`];
      if (id) {
        this.userData = await this.userDataService.getUserData(id).toPromise();
        this.stateUserData = this.userData.state;
        this.initialDas = this.userData.dasId;
        this.oldId = this.userData.id;

      }
    });
  }


  update(): void {
    this.userData.roles = this.Roles.listAssign;
    this.userData.state = this.stateUserData;
    if (this.userData.state === 3) {
      this.inactivate(this.userData);
    }
    this.userDataService.update(this.userData)
      .subscribe( () => {
        this.router.navigate(['/manolito/usuarios/listar/pagina/0']);
        swal.fire(this.translate.instant('userData.modify.userModifiedTitle'), '', 'success');
      },
        err => {
          // this.errors = err.error.errors as string[];
        });
  }

  inactivate(userData: UserData): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: this.translate.instant('userData.modify.stateTitle'),
      text: this.translate.instant('userData.modify.inactivateUserPopupMsg', { das: userData.dasId }),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('userData.modify.inactivateUserPopupBtnAccept'),
      cancelButtonText: this.translate.instant('userData.modify.inactivateUserPopupBtnCancel'),
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.userData.state = 4;
        this.stateUserData = 4;
      } else {
        this.userData.state = 2;
        this.stateUserData = 2;
      }
    });
  }

  activate(userData: UserData): void {
    userData.state = 2;
  }

  close(): void {
    this.router.navigate(['/manolito/usuarios/listar/pagina/0']);
  }

}
