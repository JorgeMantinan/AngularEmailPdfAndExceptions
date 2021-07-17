import {
  AbstractControl, AsyncValidator,
  NG_ASYNC_VALIDATORS, AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { RoleService } from '../../Service/role.service';
import { TranslateService } from '@ngx-translate/core';


/**
 * Esta clase permite realizar la comprobación de si un nombre de rol ya existe en la
 * BBDD. Para ello realiza una consulta asíncrona al backend preguntando si el
 * nombre que envía ya existe. En caso afirmativo se muestra el correspondiente
 * mensaje de error debajo del campo nombre del rol.
 *
 * @author FGS
 * @since  16/12/2019
 */

export function documentValidation(roleService: RoleService,
                                   initialId: number, translate: TranslateService): AsyncValidatorFn {
  return (
    control: AbstractControl
    ):
    Promise<ValidationErrors | null>
    | Observable<ValidationErrors | null> => {
      return roleService.isRoleNameRegisteredV2(control.value, initialId).toPromise().then(
        (result: boolean) => {
          if (result) {
            return { roleNameExistsValidator: translate.instant('usersDataExtended.validator.roleNameInUseErrMsg')};
          } else {
            return null;
          }
        }
      );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[roleNameExistsValidator][ngModel],[roleNameExistsValidator][FormControl]',
  providers: [
      {provide: NG_ASYNC_VALIDATORS, useExisting: RoleNameExistsValidator, multi: true}
  ]
})
export class RoleNameExistsValidator implements AsyncValidator {

  @Input() roleNameExistsValidator: number;

  constructor(private roleService: RoleService, private translate: TranslateService) {
  }


  validate(control: AbstractControl): Promise<ValidationErrors | null>
   | Observable<ValidationErrors | null> {
    return documentValidation(this.roleService, this.roleNameExistsValidator, this.translate)(control);
  }

}
