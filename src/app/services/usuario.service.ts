import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor (private http: HttpClient) { }
  ListarTodosUsuarios (): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiUrl_Usuarios);
  }
  ListarUsuariosPorMatricula (matricula): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiUrl_Usuarios + '/' + matricula);
  }
}
