import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { SkillsAddComponent } from './skills-add/skills-add.component';
import { SkillsEditComponent } from './skills-edit/skills-edit.component';
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { NgaModule } from "app/theme/nga.module";
import { HotTableModule } from "ng2-handsontable";
import { SharedModule } from '../../common/shared.module';
import { SkillsService } from "./skills.service";
import { SkillsDataService } from "./skills-data.service";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    SkillsRoutingModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    DataTableModule,
    HttpModule,
    HotTableModule
  ],
  declarations: [SkillsListComponent, SkillsAddComponent, SkillsEditComponent],
  providers: [SkillsDataService, SkillsService]
})
export class SkillsModule { }
