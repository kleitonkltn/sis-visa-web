import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AutenticarService } from '../services/autenticar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor (private autenticar: AutenticarService) { }

  async canActivate (): Promise<boolean> {
    return this.autenticar.isAuthenticated();
  }

}
