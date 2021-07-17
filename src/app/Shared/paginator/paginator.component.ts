import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import defaultLanguage from '../../../assets/i18n/es.json';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html'
})
// dt003-DCS-12/11/2019
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() route: string;
  @Input() paginator: any;

  first = 'Primera';
  last = 'Ultima';
  pages: number[];

  since: number;
  until: number;

  constructor(private translate: TranslateService) {
    // FGS 29/11/19. Para mensajes en ficheros externos
    translate.setTranslation('es', defaultLanguage);
    translate.setDefaultLang('es');
  }

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges) {
    const updatePaginator = changes.paginator;

    if (updatePaginator.previousValue) {
      this.initPaginator();
    }

  }

  private initPaginator(): void {
    this.since = Math.min(Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);
    this.until = Math.max(Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);
    if (this.paginator.totalPages > 5) {
      // tslint:disable-next-line: variable-name
      this.pages = new Array(this.until - this.since + 1).fill(0).map((_value, index) => index + this.since);
    } else {
      // tslint:disable-next-line: variable-name
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_value, index) => index + 1);
    }
  }

}
