import {
  AbstractControl, AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors, AsyncValidatorFn
} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UsersDataExtendedService } from '../../Service/usersDataExtended.service';

export function documentValidation(udeService: UsersDataExtendedService, initialId: number,
                                   translate: TranslateService): AsyncValidatorFn {
  return (
    control: AbstractControl
    ):
    Promise<ValidationErrors | null>
    | Observable<ValidationErrors | null> => {
      return udeService.isIbanNumberRegistered(control.value, initialId).toPromise().then(
        (result: boolean) => {
          if (result) {
            let message; // FGS 24/12/19 Esto es porque no estaba recogiendo bien el mensaje del fichero json.
            translate.get('usersDataExtended.validator.numberInUseErrMsg').subscribe(res => {message = res; });
            return { ibanExistsValidator: message};
           } else {
            return null;
          }
        }
      );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ibanExistsValidator][ngModel],[ibanExistsValidator][FormControl]',
  providers: [
      {provide: NG_ASYNC_VALIDATORS, useExisting: IbanExistsValidator, multi: true}
  ]
})
export class IbanExistsValidator implements AsyncValidator {

  // Esta variable contiene el identificador, en BD, del usuario que quiere tomar ese IBAN.
  @Input() ibanExistsValidator: number;

  constructor(private udeService: UsersDataExtendedService, private translate: TranslateService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null>
   | Observable<ValidationErrors | null> {
    return documentValidation(this.udeService, this.ibanExistsValidator, this.translate)(control);
  }
}
