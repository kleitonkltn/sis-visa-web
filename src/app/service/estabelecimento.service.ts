import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Estabelecimento } from '../../models/estabelecimento'
import { Observable } from 'rxjs'
import { environment } from './../../environments/environment'




@Injectable()
export class EstabelecimentoService {
  constructor (private http: HttpClient) {
  }



  ListarTodosEstabelecimentos (): Observable<Estabelecimento[]> {

    return this.http.get<Estabelecimento[]>(environment.apiUrl_Estabelecimento)

  }

  cadastrarEstabelecimento (Client: Estabelecimento) {
    return this.http.post(environment.apiUrl_Estabelecimento, Client)
  }

  listarEstabelecimentoPorID (id): Observable<Estabelecimento> {
    return this.http.get<Estabelecimento>(environment.apiUrl_Estabelecimento + '/' + parseInt(id))
  }
  atualizarEstabelecimento (Client: Estabelecimento, id) {
    return this.http.put(environment.apiUrl_Estabelecimento + '/' + id, Client)
  }


  //CNAE
  listarTodosCnae () {
    return this.http.get(environment.apiUrl_cnae)
  }
  listarCnaePorID (id) {
    return this.http.get(environment.apiUrl_cnae + '/' + parseInt(id))
  }


  //Atividades
  ListarTodasAtividades () {
    return this.http.get(environment.apiUrl_Ativiades)
  }
  ListarAtividadesPorID (id) {
    return this.http.get(environment.apiUrl_Ativiades + '/' + parseInt(id))
  }


  getValueMaxLicenca () {
    return this.http.get(environment.apiUrl_Estabelecimento + '/max/licenca')
  }

}
