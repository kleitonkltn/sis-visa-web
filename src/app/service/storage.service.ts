import { Injectable } from '@angular/core';
import { Usuario } from '../login/usuario';
import { Estabelecimento } from '../estabelecimento';

const TOKEN_KEY = '_token';
const USER_KEY = '_user';
const ESTABELECIMENTO_KEY = 'estabelecimentos';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  addToken(token) {
    
    return localStorage.setItem(TOKEN_KEY, token);
  }

  deleteToken() {
    return new Promise((resolve, reject) => {
      localStorage.setItem(USER_KEY, '');
      resolve(localStorage.setItem(TOKEN_KEY, ''));  
    });
    
  }

  getStorageToken() {
    return new Promise((resolve, reject) => {
      resolve(localStorage.getItem(TOKEN_KEY))
    });
  }

  setUser(user: Usuario) {
    return localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  deleteUser() {
    return localStorage.setItem(USER_KEY, '');
  }

  getStorageUser() {
    return localStorage.getItem(USER_KEY)
  }

}
