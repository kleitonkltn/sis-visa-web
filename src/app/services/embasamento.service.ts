import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmbasamentoService {

  constructor(private http: HttpClient) { }

  listAllEmbasamentos() {
    return this.http.get(environment.apiUrl_Embasamento);
  }
  createEmbasamentos(Client) {
    return this.http.post(environment.apiUrl_Embasamento, Client);
  }
  listEmbasamentosById(id) {
    return this.http.get(environment.apiUrl_Embasamento + '/' + id);
  }
  updateEmbasamentos(Client) {
    return this.http.put(environment.apiUrl_Embasamento + '/' + Client.id, Client);
  }
}
