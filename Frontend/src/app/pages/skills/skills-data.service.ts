import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment } from "environments/environment";

@Injectable()
export class SkillsDataService {


  constructor(private http: Http) { }


  public getAllSkills() {

    return this.http.get(environment.backendUrl + 'wf/skills');
  }

  public removeSkill(skillId: string) {

    return this.http.delete(environment.backendUrl + 'wf/skills/' + skillId);
  }

}
