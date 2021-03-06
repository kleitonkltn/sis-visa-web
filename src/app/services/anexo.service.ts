import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Arquivos } from '../../models/arquivos';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  constructor (private http: HttpClient) { }

  listFilesByModel (model, id): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos2 + '/' + model + '/' + id);
  }

  createAnexo (Client: Arquivos) {
    return this.http.post(environment.apiUrl_Anexos2, Client);
  }
  listAnexoById (id): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos2 + '/' + id);
  }
  listAllAnexos (): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos2);
  }

  salvarAnexo (Client: Arquivos) {
    return this.http.post(environment.apiUrl_Anexos2, Client);
  }

  deleteFileByKey (key) {
    return this.http.delete(environment.apiUrl_Anexos2 + '/' + key);
  }
}
