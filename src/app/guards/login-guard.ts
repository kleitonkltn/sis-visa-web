import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AutenticarService } from '../service/autenticar.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private autenticar: AutenticarService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.autenticar.isAuthenticated()) {
            return true;
        }

    }
}