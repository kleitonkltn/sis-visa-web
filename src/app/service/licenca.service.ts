import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Licencas } from '../licencas';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicencaService {
  constructor(private http: HttpClient) {
  }

  ListarTodosLicencas(): Observable<Licencas[]> {
    return this.http.get<Licencas[]>(environment.apiUrl_Licencas);
  }
  ListarLicencaPorID(id): Observable<Licencas> {
    return this.http.get<Licencas>(environment.apiUrl_Licencas + '/' + id);
  }
  createLicenca(Client: Licencas) {
    return this.http.post(environment.apiUrl_LicencasPost, Client);
  }
  updateLicenca(Client: Licencas) {
    return this.http.put(environment.apiUrl_LicencasPost + '/' + Client.id, Client);
  }
}
