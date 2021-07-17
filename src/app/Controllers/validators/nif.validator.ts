import { Directive, Input } from '@angular/core';
import {  AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Directive({
  selector: '[nifValidator][ngModel]',
  providers: [
      {provide: NG_VALIDATORS, useExisting: NifValidator, multi: true}
  ]
})
export class NifValidator implements Validator {

  NIF_REGEX = /([0-9]{8})([A-Z])/i;

  constructor(private translate: TranslateService) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
      let val = control.value;
      if (val != null || typeof val === 'string' && val.length === 9) {
        val = val.toUpperCase().replace(/\s/, '');

        if (!this.isValidFormatNif(val)) {
          return { nifValidator: this.translate.instant('usersDataExtended.validator.nifInvalidFormatErrMsg')};
        }
        if (this.isValidDCNif(val)) {
          return null; // El número es válido.
        } else {
          return { nifValidator: this.translate.instant('usersDataExtended.validator.nifnieInvalidDCErrMsg')};
        }
      }
  } // Fin del método validate

  /**
   *
   * @param strNif NIF cuyo formato se va a comprobar.
   * @author FGS
   * @since  17/12/2019
   */
  private isValidFormatNif(strNif: string) {

   return this.NIF_REGEX.test(strNif.trim());

  }
  /**
   * Este método comprueba que el número de la Seguridad Social recibido como
   * parámetro sea válido, es decir, que la letra de control coincida con
   * el número.
   * Formato: 9 caracteres: 8 dígitos (número) 1 letra (de control)
   * La letra de control se calcula a partir del número.
   *
   * @author FGS
   * @since 17/12/19
   * @param strNif
   */
  public isValidDCNif(strNif: string) {
    let isValid = false;
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const numero = Number(strNif.substr(0, strNif.length - 1));
    const letra = strNif.substr(strNif.length - 1, 1);
    const indexLetter = numero % 23;
    const calculatedLetter = validLetters.charAt(indexLetter);

    isValid = (calculatedLetter === letra);
    return isValid;
  }
}
