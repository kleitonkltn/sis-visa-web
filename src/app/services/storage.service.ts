/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario';

const TOKEN_KEY = '_token';
const USER_KEY = '_user';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  addToken (token: string) {
    return localStorage.setItem(TOKEN_KEY, token);
  }

  deleteToken () {
    return new Promise((resolve) => {
      localStorage.setItem(USER_KEY, '');
      resolve(localStorage.setItem(TOKEN_KEY, ''));
    });

  }

  getStorageToken (): Promise<string> {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(TOKEN_KEY));
    });
  }

  setUser (user: Usuario) {
    return localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  deleteUser () {
    return localStorage.setItem(USER_KEY, '');
  }

  getStorageUser () {
    return localStorage.getItem(USER_KEY);
  }

}
