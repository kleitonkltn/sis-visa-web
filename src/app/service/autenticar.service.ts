/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, EventEmitter } from '@angular/core'
import { Usuario } from '../../models/usuario'
import { BehaviorSubject } from 'rxjs'
import { StorageService } from './storage.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { LoginProviderService } from '../providers/login-provider-service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import Swal from 'sweetalert2'

declare let $: any

@Injectable({
  providedIn: 'root'
})

export class AutenticarService {
  _user: Usuario = null;
  authenticationState = new BehaviorSubject(false);
  _token
  loading = true;

  constructor (private storage: StorageService, private location: Location,
    private loginProvider: LoginProviderService, private router: Router, private helper: JwtHelperService) {
  }

  async checkToken () {
    const token = await this.storage.getStorageToken()
    if (token) {
      const decoded = this.helper.decodeToken(token)
      const isExpired = this.helper.isTokenExpired(token)
      if (!isExpired) {
        this._user = decoded
        this._token = token
        this.storage.setUser(this._user)
        this.authenticationState.next(true)
      } else {
        this.showDialogMessage('Sessão Finalizada, Logue Novamente', 'danger')
        this.authenticationState.next(false)
        this.storage.deleteToken()
        this.storage.deleteUser()
      }
    }
  }

  login (credentials) {
    this.loading = false
    return this.loginProvider.login(credentials)
      .subscribe(res => {
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
      }, (e) => {
        return this.showDialogMessage('Matrícula e/ou senha incorreta. Verifique suas credenciais', 'error')
      }).add(() => {
        this.loading = true
      })
  }

  logout () {
    this.storage.deleteToken().then(() => {
      this.authenticationState.next(false)
      location.reload()
    })
  }

  isAuthenticated () {
    this.checkToken()
    return this.authenticationState.value
  }

  showDialogMessage (mensagem, tipo) {
    this.loading = true
    Swal.fire({
      icon: tipo || 'warning',
      title: mensagem,
      showConfirmButton: false,
      timer: 2000
    })
  }

}
