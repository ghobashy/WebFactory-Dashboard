import { Injectable } from '@angular/core';
import { SkillsDataService } from "app/pages/skills/skills-data.service";

@Injectable()
export class SkillsService {

  constructor(private skillsDataService: SkillsDataService) { }


  getAllSkills() {
    return this.skillsDataService.getAllSkills().map((skills) => {
      return skills.json();
    });
  }

}
