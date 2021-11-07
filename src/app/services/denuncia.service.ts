import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Denuncias } from '../../models/denuncias';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  constructor (private http: HttpClient) {
  }
  createDenuncias (data: Denuncias) {
    return this.http.post(environment.apiUrl_Denuncias, data);
  }
  ListarTodasDenuncias (): Observable<Denuncias[]> {
    return this.http.get<Denuncias[]>(environment.apiUrl_Denuncias);
  }
  ListarDenunciasPorID (id: string): Observable<Denuncias> {
    return this.http.get<Denuncias>(environment.apiUrl_Denuncias + '/' + id);
  }
  atualizarDenuncia (data: Denuncias): Observable<Denuncias[]> {
    return this.http.put<Denuncias[]>(environment.apiUrl_Denuncias + '/' + data.id, data);
  }

}
