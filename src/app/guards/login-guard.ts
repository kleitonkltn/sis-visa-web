import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AutenticarService } from '../services/autenticar.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor (private autenticar: AutenticarService, private router: Router) { }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.autenticar.isAuthenticated())
    {
      return true;
    }

  }
}
