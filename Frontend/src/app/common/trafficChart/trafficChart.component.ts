import { Component, Input } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { TrafficChartService } from './trafficChart.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'traffic-chart',
  templateUrl: './trafficChart.html',
  styleUrls: ['./trafficChart.scss']
})

// TODO: move chart.js to it's own component
export class TrafficChart {
  @Input()
  private resourceId: any;
  public doughnutData: Array<Object>;
  public totalScore: Number;
  public fullScore: Number;
  constructor(private trafficChartService: TrafficChartService) {

  }

  ngOnInit() {
    this.trafficChartService.getSkillMatrix(this.resourceId).subscribe((response: Response) => {
      let skillMatrix = response.json();
      this.doughnutData = this.trafficChartService.getData(skillMatrix);
      this._loadDoughnutCharts();
      this.totalScore = this.trafficChartService.totalScore;
      this.fullScore = this.trafficChartService.fullScore;
    }, error => {
      console.log(JSON.stringify(error.json()));
    });
  }

  ngAfterViewInit() {
    //this._loadDoughnutCharts();
  }

  private _loadDoughnutCharts() {
    let el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
    new Chart(el.getContext('2d')).Doughnut(this.doughnutData, {
      segmentShowStroke: false,
      percentageInnerCutout: 64,
      responsive: true
    });
  }
}
