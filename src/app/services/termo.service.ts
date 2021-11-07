import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Termos } from '../../models/termos';

@Injectable({
  providedIn: 'root'
})
export class TermoService {
  constructor (private http: HttpClient) {
  }

  ListarTodosTermos (): Observable<Termos[]> {
    return this.http.get<Termos[]>(environment.apiUrl_Termo);
  }
  ListarTermoPorID (id: number): Observable<Termos> {
    return this.http.get<Termos>(environment.apiUrl_Termo + '/' + id);
  }

  atualizarTermo (data: Termos) {
    return this.http.put(environment.apiUrl_Termo + '/' + data.id, data);
  }

  cadastrarTermo (data: Termos) {
    return this.http.post(environment.apiUrl_Termo, data);
  }
}
