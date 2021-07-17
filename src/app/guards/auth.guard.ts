import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root'
})
// Manti octubre 2019
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      if (this.isExpiredToken()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return true;
    }
  }

  isExpiredToken(): boolean {
    const token = this.authService.token;
    const payload = this.authService.getDataToken(token);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
