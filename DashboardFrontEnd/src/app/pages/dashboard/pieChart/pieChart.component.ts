import {Component, ViewEncapsulation} from '@angular/core';

import {BaCard} from '../../../theme/components';
import {PieChartService} from './pieChart.service';
import {ALMService} from '../../../alm.service';

import './pieChart.loader.ts';

@Component({
  selector: 'pie-chart',
  encapsulation: ViewEncapsulation.None,
  directives: [BaCard],
  providers: [PieChartService, ALMService],
  styles: [require('./pieChart.scss')],
  template: require('./pieChart.html')
})
// TODO: move easypiechart to component
export class PieChart {

  public charts:Array<Object>;
  private _init = false;
  private outputDefects:{};

  constructor(private _pieChartService:PieChartService, private _almService:ALMService) {
    this.defectsStats = [];
    this.charts = this._pieChartService.getData();
    this._almService.getAllOpenDefects().subscribe(data => this.outputDefects = data,
      err => console.log(err),
      () => {

        this.defectsStats.push({
          description: 'New/Open Defects',
          stats: this.outputDefects.length,
        });

        this._almService.getAllInProgressDefects().subscribe(data => this.outputDefects = data,
          err => console.log(err),
          () => {

            this.defectsStats.push({
              description: 'In Progress',
              stats: this.outputDefects.length,
            });

            this._almService.getAllFixedDefects().subscribe(data => this.outputDefects = data,
              err => console.log(err),
              () => {

                this.defectsStats.push({
                  description: 'Fixed',
                  stats: this.outputDefects.length,
                });

                this._almService.getAllClosedDefects().subscribe(data => this.outputDefects = data,
                  err => console.log(err),
                  () => {

                    this.defectsStats.push({
                      description: 'Closed',
                      stats: this.outputDefects.length,
                    });

                    this.charts = this._pieChartService.getData(this.defectsStats);

                  });
              });

          });

      });
  }

  ngAfterViewInit() {
    if (!this._init) {
      this._loadPieCharts();
      this._updatePieCharts();
      this._init = true;
    }
  }

  private _loadPieCharts() {

    jQuery('.chart').each(function () {
      let chart = jQuery(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          jQuery(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: jQuery(this).attr('data-rel'),
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
  }

  private _updatePieCharts() {
    let getRandomArbitrary = (min, max) => {
      return Math.random() * (max - min) + min
    };

    jQuery('.pie-charts .chart').each(function (index, chart) {
      jQuery(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
    });
  }
}
