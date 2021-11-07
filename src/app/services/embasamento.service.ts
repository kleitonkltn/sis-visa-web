import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Embasamentos } from 'src/models/embasamentos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmbasamentoService {

  constructor (private http: HttpClient) { }

  listAllEmbasamentos () {
    return this.http.get(environment.apiUrl_Embasamento);
  }
  createEmbasamentos (data: Embasamentos) {
    return this.http.post(environment.apiUrl_Embasamento, data);
  }
  listEmbasamentosById (id: string) {
    return this.http.get(environment.apiUrl_Embasamento + '/' + id);
  }
  updateEmbasamentos (data: Embasamentos) {
    return this.http.put(environment.apiUrl_Embasamento + '/' + data.id, data);
  }
}
