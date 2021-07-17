import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../Service/userData.service';
import { AuthService } from '../Service/auth.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-activate',
  templateUrl: '../View/activate.component.html'
})
export class ActivateComponent implements OnInit {


  password: string;
  newPassword: string;
  show1 = false;
  show2 = false;

  // tslint:disable-next-line: max-line-length
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private userDataService: UserDataService,
    private authService: AuthService,
    private translate: TranslateService) {
      this.show1 = false;
      this.show2 = false;
      // FGS 28/11/19. Para mensajes en ficheros externos
    }

  ngOnInit() {
  }

  changePassword(): void {
    this.router.paramMap.subscribe(
      param => {const dasid = param.get('dasId');
                if (this.password === this.newPassword) {
          this.userDataService.updatePassword(dasid, this.password).subscribe(response => {
            swal.fire(this.translate.instant('activate.pwdChangeOkTitle'), this.translate.instant('activate.pwdChangeOkMsg'),
            'success');
            this.route.navigate(['/manolito/login']);
            }, err => {
              if (err.status === 400) {
                swal.fire(this.translate.instant('activate.pwdChangeErrorTitle'),
                  this.translate.instant('activate.pwdChangeErrorRequisiteMsg'), 'error');
              }
              if (err.status === 500) {
                swal.fire(this.translate.instant('activate.pwdChangeErrorTitle'),
                this.translate.instant('activate.pwdChangeErrorFailAppMsg'), 'error');
              }
            }
            );
      } else {
        swal.fire(this.translate.instant('activate.pwdChangeErrorTitle'),
          this.translate.instant('activate.pwdChangeErrorDiffPwdsMsg'), 'error');
      }
    }
    );
  }

  viewPassword1() {
    this.show1 = !this.show1;
  }
  viewPassword2() {
    this.show2 = !this.show2;
  }
}
