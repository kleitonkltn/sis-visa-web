import { Injectable, EventEmitter } from '@angular/core'
import { Usuario } from '../../models/usuario'
import { BehaviorSubject } from 'rxjs'
import { StorageService } from './storage.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { LoginProviderService } from '../providers/login-provider-service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

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
      .toPromise().then(res => {
        if (res['token'] && !res['error']) {
          this._user = this.helper.decodeToken(res['token'])
          this.storage.addToken(res['token'])
          this.storage.setUser(this._user)
          this.authenticationState.next(true)
          location.reload()
          this.loading = true
        } else {
          this.authenticationState.next(false)
          this.showDialogMessage('Matrícula e/ou senha incorreta, verifique suas credenciais', 'danger')
        }
      }, (err) => {
        throw err
      }).catch(() => {
        this.showDialogMessage('Matrícula e/ou senha incorreta \n Verifique suas credenciais', 'danger')
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
    const cssMessage = 'display: block; position: fixed; top: 0; left: 20%; right: 20%; width: 60%; padding-top: 10px; z-index: 9999;'
    const cssInner = 'margin: 0 auto; box-shadow: 1px 1px 5px black;'
    let dialogo = ''
    dialogo += '<div id="message" style="' + cssMessage + '">'
    dialogo += '    <div class="alert alert-' + tipo + ' alert-dismissable" style="' + cssInner + '">'
    dialogo += '    <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>'
    dialogo += mensagem
    dialogo += '    </div>'
    dialogo += '</div>'
    $('body').append(dialogo)

    window.setTimeout(() => {
      $('#message').fadeTo(1500, 0).slideDown(1000, () => {
        $('.alert').hide()
      })
    }, 2000)

  }

}
