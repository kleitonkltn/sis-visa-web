import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor (private http: HttpClient) {
  }

  sendTermoByEmail (data: any) {
    return this.http.post(environment.apiUrl_sendTermo, data);
  }
  sendLicencaByEmail (data: any) {
    return this.http.post(environment.apiUrl_sendLicenca, data);
  }
  sendRelatorioByEmail (data: any) {
    return this.http.post(environment.apiUrl_sendRelatorio, data);
  }
  sendProtocoloByEmail (data: any) {
    return this.http.post(environment.apiUrl_sendProtocolo, data);
  }
}
