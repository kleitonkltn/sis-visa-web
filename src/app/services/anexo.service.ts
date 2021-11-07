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

  listFilesByModel (model: string, id: string): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos + '/' + model + '/' + id);
  }

  createAnexo (data: Arquivos) {
    return this.http.post(environment.apiUrl_Anexos, data);
  }
  listAnexoById (id: string): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos + '/' + id);
  }
  listAllAnexos (): Observable<Arquivos[]> {
    return this.http.get<Arquivos[]>(environment.apiUrl_Anexos);
  }

  salvarAnexo (Client: Arquivos) {
    return this.http.post(environment.apiUrl_Anexos, Client);
  }

  deleteFileByKey (key) {
    return this.http.delete(environment.apiUrl_Anexos + '/' + key);
  }
}
