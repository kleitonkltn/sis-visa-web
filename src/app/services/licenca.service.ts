import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import Licencas from '../../models/licencas'

@Injectable({
  providedIn: 'root'
})
export class LicencaService {
  constructor(private http: HttpClient) {
  }

  fetchAllLicences(): Observable<Licencas[]> {
    return this.http.get<Licencas[]>(environment.apiUrl_Licencas)
  }
  ListarLicencaPorID(id: string): Observable<Licencas> {
    return this.http.get<Licencas>(environment.apiUrl_Licencas + '/' + id)
  }
  createLicenca(licenca: Licencas) {
    return this.http.post(environment.apiUrl_Licencas, licenca)
  }
  updateLicenca(licenca: Licencas) {
    return this.http.put(`${environment.apiUrl_Licencas}/${licenca.id}`, licenca)
  }
  assinarLicenca(licenca: Licencas) {
    return this.http.post(`${environment.apiUrl_assinarLicenca}`, { id_licenca: licenca.id, pendente: false })
  }
}
