import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario';
import { LoginProviderService } from '../providers/login-provider-service';
import { StorageService } from './storage.service';

declare let $: any;

@Injectable({
  providedIn: 'root'
})

export class AutenticarService {
  _user: Usuario = null;
  authenticationState = new BehaviorSubject(false);
  _token: string;
  loading = true;

  constructor (
    private loginProvider: LoginProviderService,
    private helper: JwtHelperService,
    private storage: StorageService,
  ) {
  }

  async checkToken () {
    const token = await this.storage.getStorageToken();
    if (token) {
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);
      if (!isExpired) {
        this._user = decoded;
        this._token = token;
        this.storage.setUser(this._user);
        this.authenticationState.next(true);
      } else {
        this.showDialogMessage('Sessão Finalizada, Logue Novamente', 'error');
        this.authenticationState.next(false);
        this.storage.deleteToken();
        this.storage.deleteUser();
      }
    }
  }

  login (credentials) {
    this.loading = false;

    return this.loginProvider.login(credentials)
      .subscribe(res => {
        if (res['token']) {
          this._user = this.helper.decodeToken(res['token']);
          this.storage.addToken(res['token']);
          this.storage.setUser(this._user);
          this.authenticationState.next(true);
          location.reload();
          this.loading = true;
        } else {
          return this.showDialogMessage('Matrícula e/ou senha incorreta. Verifique suas credenciais', 'error');
        }
      }, (_) => {
        return this.showDialogMessage('Matrícula e/ou senha incorreta. Verifique suas credenciais', 'error');
      }).add(() => {
        this.loading = true;
      });
  }

  logout () {
    this.storage.deleteToken().then(() => {
      this.authenticationState.next(false);
      location.reload();
    });
  }

  isAuthenticated () {
    this.checkToken();

    return this.authenticationState.value;
  }

  showDialogMessage (mensagem: string, tipo?) {
    this.loading = true;
    Swal.fire({
      icon: tipo || 'warning',
      title: mensagem,
      showConfirmButton: false,
      timer: 2000
    });
  }

}
