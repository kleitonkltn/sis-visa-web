import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estabelecimento } from '../../models/estabelecimento';

@Injectable()
export class EstabelecimentoService {
  constructor (private http: HttpClient) {
  }

  ListarTodosEstabelecimentos (): Observable<Estabelecimento[]> {

    return this.http.get<Estabelecimento[]>(environment.apiUrl_Estabelecimento);

  }

  cadastrarEstabelecimento (Client: Estabelecimento) {
    return this.http.post(environment.apiUrl_Estabelecimento, Client);
  }

  listarEstabelecimentoPorID (id: string): Observable<Estabelecimento> {
    return this.http.get<Estabelecimento>(`${environment.apiUrl_Estabelecimento}/${id}`);
  }
  atualizarEstabelecimento (Client: Estabelecimento, id: string) {
    return this.http.put(environment.apiUrl_Estabelecimento + '/' + id, Client);
  }

  //CNAE
  listarTodosCnae () {
    return this.http.get(environment.apiUrl_cnae);
  }
  listarCnaePorID (id: string) {
    return this.http.get(`${environment.apiUrl_cnae}/${id}`);
  }

  //Atividades
  ListarTodasAtividades () {
    return this.http.get(environment.apiUrl_Ativiades);
  }
  ListarAtividadesPorID (id: string) {
    return this.http.get(`${environment.apiUrl_Ativiades}/${id}`);
  }

  getValueMaxLicenca () {
    return this.http.get(`${environment.apiUrl_Estabelecimento}/max/licenca`);
  }

}
