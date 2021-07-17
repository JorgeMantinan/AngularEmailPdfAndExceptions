import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import localeES from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatRadioModule,
         MatCheckboxModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { LoginComponent } from './Controllers/login.component';
import { ActivateComponent } from './Controllers/activate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUsrComponent } from './Controllers/User/create.component';
import { CreateRoleComponent } from './Controllers/Role/create.component';
import { HeaderComponent } from './Controllers/header.component';
import { UsersDataComponent } from './Controllers/usersData.component';
import { ModifyUsrComponent } from './Controllers/User/modify.component';
import { ModifyRoleComponent } from './Controllers/Role/modify.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { RolesComponent } from './Controllers/roles.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { WelcomeComponent } from './Controllers/welcome.component';
import { DualListComponent } from './Shared/dualList/dualList.component';
import { PaginatorComponent } from './Shared/paginator/paginator.component';
import { UserDataExtendedComponent } from './Controllers/userDataExtended.component';
import { UsersDataExtendedComponent } from './Controllers/usersDataExtended.component';
import { CreateUserDataExtendedComponent } from './Controllers/UserExtended/create.component';
import { ModifyUserDataExtendedComponent } from './Controllers/UserExtended/modify.component';
import { AddressComponent } from './Shared/address/address.component';
// FGS 26/11/19 import ngx-translate and the http loader
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ModalComponent } from './Shared/modal/modal.component';
// FGS 16/12/19 Para realizar distintas validaciones
import { SSNumberValidator } from './Controllers/validators/ssNumber.validator';
import { SSNumberExistsValidator } from './Controllers/validators/ssNumberExists.validator';
import { DasExistsValidator } from './Controllers/validators/dasExists.validator';
import { RoleNameExistsValidator } from './Controllers/validators/roleNameExists.validator';
// FGS 18/12/2019 Para que cargue mensajes en primer arranque
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED, DatePipe, registerLocaleData } from '@angular/common';
import { Injector, APP_INITIALIZER } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NifValidator } from './Controllers/validators/nif.validator';
import { NieValidator } from './Controllers/validators/nie.validator';
import { IbanValidator } from './Controllers/validators/iban.validator';
import { NifExistsValidator } from './Controllers/validators/nifExists.validator';
import { NieExistsValidator } from './Controllers/validators/nieExists.validator';
import { PassportExistsValidator } from './Controllers/validators/passportExistsValidator';
import { IbanExistsValidator } from './Controllers/validators/ibanExists.validator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayrollsComponent } from './Controllers/payrolls.component';
import { FiltersComponent } from './Shared/filters/filters.component';
import { PayrollComponent } from './Shared/payroll/payroll.component';
import { MatTooltipModule } from '@angular/material';
import 'hammerjs';


registerLocaleData(localeES, 'es');

// T2016 JMM 08/11/19
const routes: Routes = [
  {path: '', redirectTo: 'manolito/login', pathMatch: 'full'},
  {path: 'manolito/login', component: LoginComponent},
  {path: 'manolito/activar/:dasId', component: ActivateComponent},
  {path: 'manolito/usuarios/listar/pagina/:page', component: UsersDataComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_VER USUARIOS']}},
  {path: 'manolito/usuarios/modificar/:id', component: ModifyUsrComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_MODIFICAR USUARIOS']}},
  {path: 'manolito/usuarios/crear', component: CreateUsrComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_CREAR USUARIOS']}},
  {path: 'manolito/roles/listar/pagina/:page', component: RolesComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_VER ROLES']}},
  {path: 'manolito/roles/modificar/:id', component: ModifyRoleComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_MODIFICAR ROLES']}},
  {path: 'manolito/roles/crear', component: CreateRoleComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_CREAR ROLES']}},
  {path: 'manolito/welcome', component: WelcomeComponent,
    canActivate: [AuthGuard]},
  {path: 'manolito/usuarios/listar/:das/:nombre/:apellido', component: UsersDataComponent,
    canActivate: [AuthGuard, PermissionGuard], data: {permission: 'ROLE_VER USUARIOS'}},
  {path: 'manolito/usuarios-extendidos', component: UsersDataExtendedComponent},
  // FGS 15/11/19 Añadidas rutas para datos extendidos del usuario
  // {path: 'manolito/usuarios/datosextendidos/listar', component: UserDataExtendedComponent,
  //  canActivate: [AuthGuard, PermissionGuard], data: {permission: ['ROLE_VER DATOS EXTENDIDOS']}},
  {path: 'manolito/usuarios/datosextendidos/listar/pagina/:page', component: UsersDataExtendedComponent,
    canActivate: [AuthGuard]},
  {path: 'manolito/usuarios/datosextendidos/crear', component: CreateUserDataExtendedComponent,
    canActivate: [AuthGuard]},
  {path: 'manolito/usuarios/datosextendidos/modificar/:id', component: ModifyUserDataExtendedComponent,
    canActivate: [AuthGuard]},
  {path: 'manolito/usuarios/misdatosextendidos', component: UserDataExtendedComponent,
    canActivate: [AuthGuard]},
  {path: 'manolito/usuarios/misnominas/:id', component: PayrollsComponent,
    canActivate: [AuthGuard]}
];

/**
 * Este método fuerza la espera del arranque de la aplicación a que el fichero con
 * los mensajes se cargue completamente. Evita que en el primer arraque, se muestre
 * la pantalla de login antes de que se hayan cargado los mensajes para mostrar en
 * dicha pantalla.
 *
 * @author FGS
 * @since  18/12/2019
 * @param translate
 * @param injector
 */
export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'es';
      translate.setDefaultLang('es');
      translate.use(langToSet).subscribe(() => {
        console.log(`Lenguaje '${langToSet}' inicializado.'`);
      }, err => {
        console.error(`Problema con la inicialización del lenguaje '${langToSet}' `);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ActivateComponent,
    CreateUsrComponent,
    CreateRoleComponent,
    HeaderComponent,
    UsersDataComponent,
    ModifyUsrComponent,
    ModifyRoleComponent,
    RolesComponent,
    WelcomeComponent,
    FiltersComponent,
    UsersDataExtendedComponent,
    DualListComponent,
    PaginatorComponent,
    CreateUserDataExtendedComponent,
    ModifyUserDataExtendedComponent,
    AddressComponent,
    UserDataExtendedComponent,
    ModalComponent,
    SSNumberValidator,  // FGS 16/12/19
    SSNumberExistsValidator,
    DasExistsValidator,
    RoleNameExistsValidator,
    NifValidator,
    NieValidator,
    IbanValidator,
    NifExistsValidator,
    NieExistsValidator,
    PassportExistsValidator,
    IbanExistsValidator,
    PayrollComponent,
    PayrollsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
     // FGS 26/11/19 ngx-translate and the loader module
     TranslateModule.forRoot({
         loader: {
             provide: TranslateLoader,
             useFactory: HttpLoaderFactory,
             deps: [HttpClient]
         }
     }),
     NoopAnimationsModule,
     BrowserAnimationsModule,
     MatTooltipModule,
     MatDatepickerModule,
     MatNativeDateModule,
     MatButtonModule,
     MatFormFieldModule,
     MatInputModule,
     MatRippleModule,
     MatRadioModule,
     MatCheckboxModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    UsersDataComponent,
    UserDataExtendedComponent,
    UsersDataExtendedComponent,
    RolesComponent,
    DatePipe,
    // FGS 18/12/19 Para intentar que mensajes se carguen en primer arranque
  {provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [TranslateService, Injector],
    multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// FGS 26/11/2019 Para que funcione la compilación AOT(Ahead Of Time)
// Para más info sobre AOT, ver: https://angular.io/guide/aot-compiler
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
