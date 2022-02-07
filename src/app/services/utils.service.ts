import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Count } from 'src/models/count';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor (private http: HttpClient) { }

  getInitialCounters (): Observable<Count> {
    return this.http.get<Count>(`${environment.baseURL}count/all`);
  }
}
