import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Documentos } from 'src/models/documento';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  constructor (private http: HttpClient) { }

  listAllDocumentos () {
    return this.http.get(environment.apiUrl_Documentos);
  }
  createDocumentos (data: Documentos) {
    return this.http.post(environment.apiUrl_Documentos, data);
  }
  listDocumentosById (id: string) {
    return this.http.get(environment.apiUrl_Documentos + '/' + id);
  }
  updateDocumentos (data: Documentos) {
    return this.http.put(environment.apiUrl_Documentos + '/' + data.id, data);
  }
}
