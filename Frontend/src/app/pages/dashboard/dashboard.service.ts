import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment";
import { AuthService } from "../../auth.service";
@Injectable()
export class DashboardService {
    public currentResource;
    constructor(private http: Http, private authService: AuthService) { }
    getTeams() {
        return this.http.get(environment.backendUrl + "wf/teams");
    }
}