import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Protocolo } from '../../models/protocolo';

@Injectable()
export class PdfService {
  constructor (private http: HttpClient) {
  }

  downloadFileProtocolo (id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(environment.apiUrl_pdfProtocolo + id, { headers, responseType: 'blob' });
  }
  downloadFile (id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(environment.apiUrl_pdfLicenca + id, { headers, responseType: 'blob' });
  }
  downloadFileRelatorio (id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(environment.apiUrl_pdfRelatorio + id, { headers, responseType: 'blob' });
  }
  downloadFileTermo (id: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(environment.apiUrl_pdfTermo + id, { headers, responseType: 'blob' });
  }
}
