import { Component, OnInit } from '@angular/core';
import { DataTablesService } from "app/pages/tables/components/dataTables/dataTables.service";
import { SkillsService } from "app/pages/skills/skills.service";

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent {
  data;
  filterQuery = "";
  sortBy = "";
  sortOrder = "asc";

  constructor(private skillsService: SkillsService) {
    this.skillsService.getAllSkills().subscribe((data) => {
      this.data = data;
    });
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

}
