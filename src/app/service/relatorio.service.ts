import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Relatorio } from '../relatorio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  constructor(private http: HttpClient) { }

  createRelatorio(client: Relatorio) {
    return this.http.post(environment.apiUrl_Relatorio, client);
  }

  listAllRelatorio(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(environment.apiUrl_Relatorio);
  }

  listRelatorioeById(id): Observable<Relatorio> {
    return this.http.get<Relatorio>(environment.apiUrl_Relatorio + '/' + id);
  }

  updateRelatorios(Client) {
    return this.http.put(environment.apiUrl_Relatorio + '/' + Client.id, Client);
  }
}
