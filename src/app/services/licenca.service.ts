import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import Licencas from '../../models/licencas'

@Injectable({
  providedIn: 'root'
})
export class LicencaService {
  constructor (private http: HttpClient) {
  }

  ListarTodosLicencas (): Observable<Licencas[]> {
    return this.http.get<Licencas[]>(environment.apiUrl_Licencas)
  }
  ListarLicencaPorID (id: string): Observable<Licencas> {
    return this.http.get<Licencas>(environment.apiUrl_Licencas + '/' + id)
  }
  createLicenca (Client: Licencas) {
    return this.http.post(environment.apiUrl_LicencasPost, Client)
  }
  updateLicenca (Client: Licencas) {
    return this.http.put(environment.apiUrl_Licencas + '/' + Client.id, Client)
  }
}
