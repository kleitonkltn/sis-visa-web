import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AlterarSenhaRequest } from 'src/models/alterar-senha-request'
import { environment } from '../../environments/environment'
import { Usuario } from '../../models/usuario'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor (private http: HttpClient) { }

  listarTodosUsuarios (): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiUrl_Usuarios)
  }

  alterarSenha (data: AlterarSenhaRequest) {
    return this.http.put(environment.apiUrl_alterarSenha, data)
  }
}
