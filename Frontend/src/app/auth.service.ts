import { Injectable, Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { ConfigService } from './common/config.service';

@Injectable()
export class AuthService {
    public OAuthCode: string;
    private http:Http;
    constructor(private injector: Injector, private configService: ConfigService) { }
    public loadAuthConfig(): Promise<any> {
        const authConfig = new Promise((resolve, reject) => {
            var authData = {
                client_id: environment.oauth.clientID,
                client_secret: environment.oauth.clientKey,
                grant_type: environment.oauth.grant_type,
                audience: environment.oauth.audience
            };
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            this.http = this.injector.get(Http);
            return this.http.post(environment.oauth.tokenUrl, authData, { headers: headers })
                .subscribe((response: Response) => {
                    let data = response.json();
                    this.configService.OAuthCode = data.access_token;
                    resolve(data);
                }, error => {
                    console.log(JSON.stringify(error.json()));
                    reject(error.json());
                });
        });
        return Promise.resolve(authConfig);
    }
}