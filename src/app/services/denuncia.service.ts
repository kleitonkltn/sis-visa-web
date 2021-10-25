import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Denuncias } from '../../models/denuncias';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
    constructor(private http: HttpClient) {
    }
    createDenuncias(Client: Denuncias) {
     return this.http.post(environment.apiUrl_Denuncias, Client);
    }
    ListarTodasDenuncias(): Observable<Denuncias[]> {
      return this.http.get<Denuncias[]>(environment.apiUrl_Denuncias);
    }
    ListarDenunciasPorID(id): Observable<Denuncias> {
      return this.http.get<Denuncias>(environment.apiUrl_Denuncias + '/' + id);
    }
    atualizarDenuncia(Client: Denuncias): Observable<Denuncias[]> {
      return this.http.put<Denuncias[]>(environment.apiUrl_Denuncias + '/' + Client.id, Client);
    }

  }
  