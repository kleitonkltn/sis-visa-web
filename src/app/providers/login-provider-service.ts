import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginProviderService {
  constructor (private http: HttpClient) { }

  login (Client: Usuario) {
    return this.http.post(environment.apiUrl_Login, Client);
  }
}
