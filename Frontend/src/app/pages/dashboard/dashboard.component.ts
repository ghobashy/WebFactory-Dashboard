import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  constructor(private _dashboardService: DashboardService) {
  }
  public teams: Array<Object>;
  ngOnInit() {
    this._dashboardService.getTeams().subscribe((response: Response) => {
      let data = response.json();
      this.teams = data;
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }
}
