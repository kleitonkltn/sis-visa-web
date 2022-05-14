import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AutenticarService } from '../services/autenticar.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor (private autenticar: AutenticarService) { }

  canActivate (): boolean {
    if (!this.autenticar.isAuthenticated()) {
      return true;
    }

  }
}
