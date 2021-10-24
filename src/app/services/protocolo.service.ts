import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Protocolo } from '../../models/protocolo';




@Injectable()
export class ProtocoloService {
  constructor (private http: HttpClient) {
  }

  ListarTodosProtocolos (): Observable<Protocolo[]> {
    return this.http.get<Protocolo[]>(environment.apiUrl_Protocolos);
  }
  ListarTodosProtocolosPorID (id: number): Observable<Protocolo> {
    return this.http.get<Protocolo>(environment.apiUrl_Protocolos + '/' + id);
  }

  atualizarProtocolo (Client: Protocolo, id) {
    return this.http.put(environment.apiUrl_Protocolos + '/' + id, Client);
  }

  cadastrarProtocolo (Client: Protocolo) {
    return this.http.post(environment.apiUrl_Protocolos, Client);
  }

  exportarProtocolo (id) {
    const url = 'https://ambiente-visa.herokuapp.com/api/getprotocolo';
    return this.http.get(url + '/' + id);
  }
}
