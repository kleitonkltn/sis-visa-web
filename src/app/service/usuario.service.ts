import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../login/usuario';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }
  ListarTodosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiUrl_Usuarios);
  }
  ListarUsuariosPorMatricula(matricula): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiUrl_Usuarios + '/' + matricula);
  }
}
