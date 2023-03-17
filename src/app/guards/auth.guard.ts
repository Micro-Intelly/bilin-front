import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '@app/services/user.service'

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  /**
   * The constructor function is a default function that is called when you create a new instance of a class
   * @param {Router} router - Router - This is the standard Angular 2 router.
   * @param {UserService} userService - This is the service that we created earlier.
   */
  constructor(private router: Router, private userService: UserService) { }
  /**
   * If the user is logged in, return true, otherwise navigate to the login page and return false
   * @param {ActivatedRouteSnapshot} route - ActivatedRouteSnapshot - The route that is being accessed.
   * @param {RouterStateSnapshot} state - RouterStateSnapshot
   * @returns A boolean value.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    }
    // navigate to login page as user is not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}
