import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from '../../assets/i18n/es.json';

@Component({
  selector: 'app-header',
  templateUrl: '../View/header.component.html'
})
export class HeaderComponent implements OnInit {

  title = 'Home';

  constructor(private authService: AuthService, private router: Router,
              private translate: TranslateService) {
      // FGS 28/11/19. Para mensajes en ficheros externos
      translate.setTranslation('es', defaultLanguage);
      translate.setDefaultLang('es');
    }

  ngOnInit() {
  }

  logout(): void {
    const dasId = this.authService.login.dasId;
    this.authService.logout();
    swal.fire(this.translate.instant('header.logoutTitle'),
      this.translate.instant('header.logoutMsg', {das: dasId}),
      'success');
    this.router.navigate(['/manolito/login']);
  }

}
