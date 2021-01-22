import { Injectable } from '@angular/core';
import { Usuario } from '../login/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginProviderService {
  constructor(private http: HttpClient) { }

  login(Client: Usuario) {
    return this.http.post(environment.apiUrl_Login, Client);
  }
}
