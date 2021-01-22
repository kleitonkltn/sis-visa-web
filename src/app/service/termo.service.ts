import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Termos } from '../termos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermoService {
  constructor(private http: HttpClient) {
  }

  ListarTodosTermos(): Observable<Termos[]> {
    return this.http.get<Termos[]>(environment.apiUrl_Termo);
  }
  ListarTermoPorID(id: number): Observable<Termos> {
    return this.http.get<Termos>(environment.apiUrl_Termo + '/' + id);
  }

  atualizarTermo(Client: Termos) {
    return this.http.put(environment.apiUrl_Termo + '/' + Client.id, Client)
  }

  cadastrarTermo(Client: Termos) {
    return this.http.post(environment.apiUrl_Termo, Client)
  }

  // sendTermoByEmail(Client) {
  //   return this.http.post(environment.apiUrl_sendTermo, Client)
  // }
}
