import {
  AbstractControl, AsyncValidator,
  NG_ASYNC_VALIDATORS, AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { UserDataService } from '../../Service/userData.service';
import { TranslateService } from '@ngx-translate/core';


/**
 * Esta clase permite realizar la comprobación de si un DAS ID ya existe en la
 * BBDD. Para ello realiza una consulta asíncrona al backend preguntando si el
 * DAS ID que envía ya existe. En caso afirmativo se muestra el correspondiente
 * mensaje de error debajo del campo DAS ID.
 *
 * @author FGS
 * @since  16/12/2019
 */
export function documentValidation(userService: UserDataService, initialId: number, translate: TranslateService): AsyncValidatorFn {
  return (
    control: AbstractControl
    ):
    Promise<ValidationErrors | null>
    | Observable<ValidationErrors | null> => {


      return userService.isDasRegistered(control.value, initialId).toPromise().then(
        (result: boolean) => {
          if (result) {
            return { dasExistsValidator: translate.instant('usersDataExtended.validator.dasInUseErrMsg')};
          } else {
            return null;
          }
        }
      );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dasExistsValidator][ngModel]',
  providers: [
      {provide: NG_ASYNC_VALIDATORS, useExisting: DasExistsValidator, multi: true}
  ]
})
export class DasExistsValidator implements AsyncValidator {

  @Input() dasExistsValidator: number;

  constructor(private userService: UserDataService, private translate: TranslateService) {
  }


  validate(control: AbstractControl): Promise<ValidationErrors | null>
   | Observable<ValidationErrors | null> {
    return documentValidation(this.userService, this.dasExistsValidator, this.translate)(control);
  }

}
