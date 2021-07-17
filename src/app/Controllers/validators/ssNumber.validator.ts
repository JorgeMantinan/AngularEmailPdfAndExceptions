import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors, Validator
} from '@angular/forms';
import {Directive} from '@angular/core';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[ssNumberValidator][ngModel]',
  providers: [
      {provide: NG_VALIDATORS, useExisting: SSNumberValidator, multi: true}
  ]
})
export class SSNumberValidator implements Validator {

  constructor(private translate: TranslateService) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
      const val = control.value;
      if (val != null || typeof val === 'string' && val.length === 12) {
        if (!this.isValidFormatSSNumber(val)) {
          return { ssNumberValidator: this.translate.instant('usersDataExtended.validator.ssNumberInvalidFormatErrMsg')};
        }
        if (this.isValidDCSSNumber(val)) {
          return null; // El número es válido.
        } else {
          return { ssNumberValidator: this.translate.instant('usersDataExtended.validator.ssNumberInvalidDCErrMsg')};
        }
      }
  } // Fin del método validate

  /**
   *
   * @param ssNumber Número de la seguridad social a comprobar.
   * @author FGS
   * @since  19/11/2019
   */
  private isValidFormatSSNumber(ssNumber: string) {
    let isValid = false;
    const validRegEx = /^([0-9]{12})$/i;

    isValid = validRegEx.test(ssNumber.trim());

    return isValid;
  }
  /**
   * Este método comprueba que el número de la Seguridad Social recibido como
   * parámetro sea válido, es decir, que los dígitos de control coincidan con
   * el resto del número.
   * Formato: 12 dígitos: COD_PROV(2) NUM_ASIGNADO(10) DC(2)
   * Los dígitos de control(DC) se calculan a partir del código de
   * provincia y del número asignado al afiliado.
   * No se comprueba que el parámetro sea no nulo ni que contenga sólo
   * números, porque este método se llama después de haber comprobado dichas
   * condiciones.
   *
   * @author FGS
   * @since 19/11/19
   * @param ssNumber
   */
  private isValidDCSSNumber(ssNumber: string) {
    let isValid = false;
    // dígitos de control calculados en formato numérico.
    let cd = 0;
    // cadena con los dígitos de control calculados
    let strCD: string;
    // Contendrá el número formado por el código de provincia y el número de afiliado.
    let numAux = 0;
    // Contendrá el número de afiliado a la SS
    const affiliatedNumber = parseInt(ssNumber.substring(2, 10), 10);
    if (affiliatedNumber > 10000000) {
      numAux = parseInt(ssNumber.substring(0, 10), 10);
    } else {
      numAux = affiliatedNumber +
        parseInt(ssNumber.substring(0, 2) + '0000000', 10);
    }

    cd = numAux % 97;
    strCD = cd.toString();
    // Añado un cero por la izquierda para que el DC tenga 2 caracteres.
    if (cd < 10) {
      strCD = '0' + strCD;
    }
    if (ssNumber.substring(10, 12).includes(strCD)) {
      isValid = true;
    }
    return isValid;
  }
}
