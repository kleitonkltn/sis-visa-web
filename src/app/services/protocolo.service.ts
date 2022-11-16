import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Protocolo } from '../../models/protocolo';

@Injectable({
  providedIn: 'root'
})
export class ProtocoloService {
  constructor(private http: HttpClient) {
  }

  ListarTodosProtocolos(): Observable<Protocolo[]> {
    return this.http.get<Protocolo[]>(environment.apiUrl_Protocolos);
  }
  ListarTodosProtocolosPorID(id: number): Observable<Protocolo> {
    return this.http.get<Protocolo>(environment.apiUrl_Protocolos + '/' + id);
  }

  atualizarProtocolo(data: Protocolo, id: string) {
    return this.http.put(environment.apiUrl_Protocolos + '/' + id, data);
  }

  cadastrarProtocolo(data: Protocolo) {
    return this.http.post(environment.apiUrl_Protocolos, data);
  }

  exportarProtocolo(id: string) {
    const url = 'https://ambiente-visa.herokuapp.com/api/getprotocolo';

    return this.http.get(url + '/' + id);
  }
}
