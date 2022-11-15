import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { stringify } from 'querystring'
import { BehaviorSubject } from 'rxjs'
import Swal, { SweetAlertIcon } from 'sweetalert2'
import { Usuario } from '../../models/usuario'
import { LoginProviderService } from '../providers/login.provider'
import { StorageService } from './storage.service'

declare let $: any

@Injectable({
  providedIn: 'root'
})

export class AutenticarService {
  _user: Usuario = null;
  authenticationState = new BehaviorSubject(false);
  _token: string
  loading = true;

  constructor(
    private loginProvider: LoginProviderService,
    private helper: JwtHelperService,
    private storage: StorageService,
  ) {
  }

  async checkToken(): Promise<boolean> {
    const token = await this.storage.getStorageToken()
    if (token) {
      const decoded = this.helper.decodeToken(token)
      const isExpired = this.helper.isTokenExpired(token)
      if (!isExpired) {
        this._user = decoded
        this._token = token
        this.storage.setUser(this._user)
        this.authenticationState.next(true)

        return true
      } else {
        this.showDialogMessage('Sessão Finalizada, Logue Novamente', 'error')
        this.authenticationState.next(false)
        this.storage.deleteToken()
        this.storage.deleteUser()
      }
    }

    return false
  }

  login(credentials: Usuario) {
    this.loading = false

    return this.loginProvider.login(credentials)
      .subscribe((res: any) => {
        if (res['token']) {
          this._user = this.helper.decodeToken(res['token'])
          this.storage.addToken(res['token'])
          this.storage.setUser(this._user)
          this.authenticationState.next(true)
          location.reload()
          this.loading = true
        } else {
          return this.showDialogMessage('Matrícula e/ou senha incorreta. Verifique suas credenciais', 'error')
        }
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          const errorResponse = error as HttpErrorResponse
          if (errorResponse.error.error === 'AuthenticateUserError') {
            return this.showDialogMessage('Matrícula e/ou senha incorreta. Verifique suas credenciais', 'error')
          }
        }

        return this.showDialogMessage('Serviço indisponível, aguarde um momento e tente novamente.', 'error')
      }).add(() => {
        this.loading = true
      })
  }

  logout() {
    this.storage.deleteToken().then(() => {
      this.authenticationState.next(false)
      location.reload()
    })
  }

  isAuthenticated(): Promise<boolean> {
    return this.checkToken()
  }

  showDialogMessage(mensagem: string, tipo: SweetAlertIcon) {
    this.loading = true
    Swal.fire({
      icon: tipo || 'warning',
      title: mensagem,
      showConfirmButton: false,
      timer: 2000
    })
  }

}
