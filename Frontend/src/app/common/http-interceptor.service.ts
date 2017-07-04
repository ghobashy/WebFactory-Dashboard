import { XSRFStrategy, BrowserXhr, ResponseOptions, XHRBackend, Request, XHRConnection, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Injector } from "@angular/core";
import { environment } from "../../environments/environment";
import { ConfigService } from '../common/config.service';
export class HttpInterceptor extends XHRBackend {

  constructor(
    _browserXHR: BrowserXhr,
    _baseResponseOptions: ResponseOptions,
    _xsrfStrategy: XSRFStrategy,
    private _configService: ConfigService,
    private router: Router) {
    super(_browserXHR, _baseResponseOptions, _xsrfStrategy);
  }
  createConnection(request: Request): XHRConnection {
    request.headers.append('Access-Control-Allow-Origin', "*");
    if (request.url.indexOf(environment.backendUrl) > -1) {
      request.headers.append('Authorization', 'Bearer ' + this._configService.OAuthCode);
    }
    let connection: XHRConnection = super.createConnection(request);

    return connection;
  }
}


