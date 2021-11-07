import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Relatorio } from '../../models/relatorio';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  constructor (private http: HttpClient) { }

  createRelatorio (client: Relatorio) {
    return this.http.post(environment.apiUrl_Relatorio, client);
  }

  listAllRelatorio (): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(environment.apiUrl_Relatorio);
  }

  listRelatoriosById (id): Observable<Relatorio> {
    return this.http.get<Relatorio>(environment.apiUrl_Relatorio + '/' + id);
  }

  updateRelatorios (Client) {
    return this.http.put(environment.apiUrl_Relatorio + '/' + Client.id, Client);
  }
}
