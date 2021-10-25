import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Atividades } from '../../models/atividade';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {

  constructor(private http: HttpClient) { }
  listAllAtividades(): Observable<Atividades[]> {
    return this.http.get<Atividades[]>(environment.apiUrl_Ativiades);
  }
  listAtividadeById(id): Observable<Atividades> {
    return this.http.get<Atividades>(environment.apiUrl_Ativiades + '/' + id);
  }

  updateAtividade(client: Atividades) {
    return this.http.put(environment.apiUrl_Ativiades + '/' + client.id, client);
  }
  createAtividade(client: Atividades) {
    return this.http.post(environment.apiUrl_Ativiades, client);
  }
}
