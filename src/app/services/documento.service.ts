import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  constructor(private http: HttpClient) {
  }

  listAllDocumentos() {
    return this.http.get(environment.apiUrl_Documentos);
  }
  createDocumentos(Client) {
    return this.http.post(environment.apiUrl_Documentos, Client);
  }
  listDocumentosById(id) {
    return this.http.get(environment.apiUrl_Documentos + '/' + id);
  }
  updateDocumentos(Client) {
    return this.http.put(environment.apiUrl_Documentos + '/' + Client.id, Client);
  }
}