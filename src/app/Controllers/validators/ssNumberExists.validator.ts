import {
  AbstractControl, AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors, AsyncValidatorFn
} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UsersDataExtendedService } from '../../Service/usersDataExtended.service';

export function documentValidation(udeService: UsersDataExtendedService,
                                   initialId: number, translate: TranslateService): AsyncValidatorFn {
  return (
    control: AbstractControl
    ):
    Promise<ValidationErrors | null>
    | Observable<ValidationErrors | null> => {

      return udeService.isSSNumberRegistered(control.value, initialId).toPromise().then(
        (result: boolean) => {
          if (result) {
            let message;
            translate.get('usersDataExtended.validator.numberInUseErrMsg').subscribe(res => {message = res; });
            return { ssNumberExistsValidator: message};
           } else {
            return null;
          }
        }
      );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ssNumberExistsValidator][ngModel],[ssNumberExistsValidator][FormControl]',
  providers: [
      {provide: NG_ASYNC_VALIDATORS, useExisting: SSNumberExistsValidator, multi: true}
  ]
})
export class SSNumberExistsValidator implements AsyncValidator {
  // Esta variable contiene el identificador, en BD, del usuario que quiere tomar ese Núm. SS.
  @Input() public ssNumberExistsValidator: number;
  constructor(private udeService: UsersDataExtendedService, private translate: TranslateService) {
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null>
   | Observable<ValidationErrors | null> {
    return documentValidation(this.udeService, this.ssNumberExistsValidator, this.translate)(control);
  }
}
