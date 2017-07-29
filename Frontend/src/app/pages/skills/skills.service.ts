import { Injectable } from '@angular/core';
import { SkillsDataService } from "app/pages/skills/skills-data.service";

@Injectable()
export class SkillsService {

  constructor(private skillsDataService: SkillsDataService) { }


  getAllSkills() {
    return this.skillsDataService.getAllSkills().map((skills) => skills.json());
  }

  public removeSkill(skillId: string) {

    return this.skillsDataService.removeSkill(skillId).map((removedSkill) => removedSkill.json());
  }
}
