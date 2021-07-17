import { Component, OnInit } from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import defaultLanguage from '../../assets/i18n/es.json';

@Component({
  selector: 'app-welcome',
  templateUrl: '../View/welcome.component.html'
})
export class WelcomeComponent implements OnInit {

  constructor(private translate: TranslateService) {
      // FGS 28/11/19. Para mensajes en ficheros externos
      translate.setTranslation('es', defaultLanguage);
      translate.setDefaultLang('es');
   }

  ngOnInit() {
  }

}
