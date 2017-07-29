import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from "environments/environment";

@Injectable()
export class SkillsDataService {


  constructor(private http: Http) { }


  public getAllSkills() {

    return this.http.get(environment.backendUrl + 'wf/skills');
  }

}
