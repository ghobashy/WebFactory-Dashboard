import { Component, OnInit } from '@angular/core';
import { DataTablesService } from "app/pages/tables/components/dataTables/dataTables.service";
import { SkillsService } from "app/pages/skills/skills.service";
import { sortBy, remove } from 'lodash';
@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent {

  private skills: any[];

  private filterQuery = "";

  private sortBy = "";

  private sortOrder = "asc";

  constructor(private skillsService: SkillsService) {

    this.skillsService.getAllSkills().subscribe((skills) => {

      this.skills = sortBy(skills, 'group');
    });
  }

  remove(skillId: string) {

    this.skillsService.removeSkill(skillId).subscribe((removedSkill: any) => {

      if (removedSkill && removedSkill._id) {

        this.skills = remove(this.skills, (skill) => skill._id !== removedSkill._id);
      }

    });
  }

}
