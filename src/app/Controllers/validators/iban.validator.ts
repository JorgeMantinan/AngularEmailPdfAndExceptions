import { Directive } from '@angular/core';
import {  AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { UsersDataExtendedService } from '../../Service/usersDataExtended.service';
import { TranslateService } from '@ngx-translate/core';



@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ibanValidator][ngModel]',
  providers: [
      {provide: NG_VALIDATORS, useExisting: IbanValidator, multi: true}
  ]
})
export class IbanValidator implements Validator {

  IBAN_ES_REGEX = /([ES])([0-9]{22})/i;

  constructor(private udeService: UsersDataExtendedService, private translate: TranslateService) {
  }

  validate(control: AbstractControl): ValidationErrors | null {
      let strIban = control.value;
      if (strIban != null || typeof strIban === 'string' && strIban.length === 24) {
        strIban = strIban.toUpperCase().replace(/\s/, '');

        if (!this.isValidFormatIbanES(strIban)) {
          return { ibanValidator: this.translate.instant('usersDataExtended.validator.ibanInvalidFormatErrMsg')};
        }

        if (this.isValidDCIban(strIban)) {
          return null; // El número es válido.
        } else {
          return { ibanValidator: this.translate.instant('usersDataExtended.validator.ibanInvalidDCErrMsg')};
        }

      }
  } // Fin del método validate

  /**
   *
   * @param strIban  IBAN cuyo formato se va a comprobar.
   * @author FGS
   * @since  19/12/2019
   */
  private isValidFormatIbanES(strIban: string) {
    let isValid = false;

    isValid = this.IBAN_ES_REGEX.test(strIban.trim());

    return isValid;
  }
  /**
   * Este método comprueba que el número IBAN recibido como parámetro
   * sea válido, es decir, que la letra de control coincida con
   * el número.
   * FORMATO DE IBAN EN ESPAÑA: 24 caracteres
   *  cod_pais DC cod_entidad cod_sucurs DC num_cuenta
   *   ES      98	   2038	    5778	   98 3000760236
   *
   * @author FGS
   * @since 23/12/19
   * @param strIban
   */
  public isValidDCIban(strIban: string) {
    let isValid = false;
    let accountNumber;
    let cd;
    let strCD = '';
    let remainder = 0;

    // Se reemplazan las letras por números A=10,...,E=14,...S=28. Y los DC = 00.
    accountNumber = strIban.substring(4, 24) + '142800';
    remainder = this.modulo(accountNumber, 97);
    cd = 98 - remainder ;
    strCD = cd.toString();
    // Añado un cero para tener 2 dígitos.
    if (cd < 10) {
      strCD = '0' + strCD;
    }
    isValid = (strIban.substring(2, 4) === strCD);
    return isValid;
  }

  modulo(value, divider) {
    let remainder = 0;
    let dividend;

    for (let i = 0; i < value.length; i += 10) {
      dividend = remainder + '' + value.substr(i, 10);
      remainder = dividend % divider;
    }
    return remainder;
  }

}
