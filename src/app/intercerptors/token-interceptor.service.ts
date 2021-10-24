
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AutenticarService } from '../services/autenticar.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor (private storage: StorageService, private auth: AutenticarService) { }
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated)
    {
      const reqToken = this.addToken(req);
      return next.handle(reqToken);
    }
    return next.handle(req);
  }


  addToken (req: HttpRequest<any>): HttpRequest<any> {
    const httpOptions = ({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.auth._token
      })
    });

    return req.clone(httpOptions);
  }
}
