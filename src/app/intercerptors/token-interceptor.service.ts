
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticarService } from '../services/autenticar.service';
import { StorageService } from '../services/storage.service';

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
