import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AutenticarService } from '../services/autenticar.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor (private authService: AutenticarService, private router: Router) { }

  async canActivate (): Promise<boolean> {
    var isAuthenticated = await this.authService.isAuthenticated()
    if (!isAuthenticated) {
      this.router.navigate(['/login'])
    }
    return isAuthenticated
  }

}
