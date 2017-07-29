import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { SkillsAddComponent } from './skills-add/skills-add.component';
import { SkillsEditComponent } from './skills-edit/skills-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: SkillsListComponent },
  { path: 'add', component: SkillsAddComponent },
  { path: 'edit', component: SkillsEditComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
