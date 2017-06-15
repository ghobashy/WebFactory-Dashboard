import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment";

@Injectable()
export class DashboardService {
    constructor(private http: Http) { }
    getAuthCode() {
        var authData = {
            client_id: environment.oauth.clientID,
            client_secret: environment.oauth.clientKey,
            grant_type: environment.oauth.grant_type,
            audience: environment.oauth.audience
        };
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(environment.oauth.tokenUrl, authData, { headers: headers })
            .subscribe(data => {
               return data;
            }, error => {
                console.log(JSON.stringify(error.json()));
            });
    }    
}