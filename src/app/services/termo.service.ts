import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountTermos, Termos } from '../../models/termos';

@Injectable({
  providedIn: 'root'
})
export class TermoService {
  constructor(private http: HttpClient) {
  }

  ListarTodosTermos(year: number): Observable<Termos[]> {
    const options = year ?
      { params: new HttpParams().set('year', year.toString()) } : {};
    return this.http.get<Termos[]>(environment.apiUrl_Termo, options);
  }

  ListarTermoPorID(id: number): Observable<Termos> {
    return this.http.get<Termos>(environment.apiUrl_Termo + '/' + id);
  }

  atualizarTermo(data: Termos) {
    return this.http.put(environment.apiUrl_Termo + '/' + data.id, data);
  }

  cadastrarTermo(data: Termos) {
    return this.http.post(environment.apiUrl_Termo, data);
  }

  countTermosByPeriod(initDate: string, endDate: string): Observable<CountTermos[]> {
    return this.http.get<CountTermos[]>(`${environment.apiUrl_Termo}/count/${initDate}/${endDate}`);
  }
}
