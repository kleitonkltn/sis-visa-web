import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AutenticarService } from '../services/autenticar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor (private autenticar: AutenticarService, private router: Router) { }

  async canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const status = await this.autenticar.isAuthenticated();

    return status;
  }
}
