import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {
  }

  sendTermoByEmail(Client) {
    return this.http.post(environment.apiUrl_sendTermo, Client);
   }
   sendLicencaByEmail(Client) {
    return this.http.post(environment.apiUrl_sendLicenca, Client);
   }
   sendRelatorioByEmail(Client) {
    return this.http.post(environment.apiUrl_sendRelatorio, Client);
   }
   sendProtocoloByEmail(Client) {
    return this.http.post(environment.apiUrl_sendProtocolo, Client);
   }
}
