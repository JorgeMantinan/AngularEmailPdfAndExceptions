import { Directive } from '@angular/core';
import {  AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { NifValidator } from './nif.validator';
import { TranslateService } from '@ngx-translate/core';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[nieValidator][ngModel]',
  providers: [
      {provide: NG_VALIDATORS, useExisting: NieValidator, multi: true}
  ]
})
export class NieValidator implements Validator {

  NIE_REGEX = /([XYZ])([0-9]{7})([A-Z])/i;
  nifValidator: NifValidator = new NifValidator(this.translate);
  constructor(private translate: TranslateService) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
      let val = control.value;


      if (val != null || typeof val === 'string' && val.length === 9) {
        val = val.toUpperCase().replace(/\s/, '');

        if (!this.isValidFormatNie(val)) {
          return { nieValidator: this.translate.instant('usersDataExtended.validator.nieInvalidFormatErrMsg')};
        }
        if (this.isValidDCNie(val)) {
          return null; // El número es válido.
        } else {
          return { nieValidator: this.translate.instant('usersDataExtended.validator.nifnieInvalidDCErrMsg')};
        }
      }
  } // Fin del método validate

  /**
   *
   * @param strNie NIF cuyo formato se va a comprobar.
   * @author FGS
   * @since  19/12/2019
   */
  private isValidFormatNie(strNie: string) {
    let isValid = false;

    isValid = this.NIE_REGEX.test(strNie.trim());

    return isValid;
  }

  private isValidDCNie(strNie: string) {
    let isValid = false;

    let niePrefix = strNie.charAt(0);
    // Convierto la letra inicial en un número
    switch (niePrefix) {
      case 'X': niePrefix = '0'; break;
      case 'Y': niePrefix = '1'; break;
      case 'Z': niePrefix = '2'; break;
    }

    isValid = this.nifValidator.isValidDCNif(niePrefix + strNie.substr(1) );


    return isValid;
  }

}
