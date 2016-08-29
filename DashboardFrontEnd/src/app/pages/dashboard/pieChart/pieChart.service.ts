import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';
import {ALMService} from '../../../alm.service';

@Injectable()
export class PieChartService {
  constructor(private _baConfig:BaThemeConfigProvider, private _almService:ALMService) {
  }

  public defectsStats:Array<Object>;
  public outputDefects:Array<Object>;

  getData() {
    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    this._almService.getAllDefects().subscribe(data => this.outputDefects = data,
      err => console.log(err),
      () => {
        this.defectsStats = [];
        let fixedDefects = this.outputDefects.filter(function (obj) {
          return obj["status"] == "Fixed";
        });
        this.defectsStats.push({
          color: pieColor,
          description: 'Fixed Defects',
          stats: fixedDefects.length,
          icon: 'refresh'
        });
        let inPorgressDefects = this.outputDefects.filter(function (obj) {
          return obj["status"] == "Noticed";
        });

        this.defectsStats.push({
          color: pieColor,
          description: 'InProgress Defects',
          stats: inPorgressDefects.length,
          icon: 'refresh'
        });
      });
    return this.defectsStats;
    /*return [
      {
        color: pieColor,
        description: 'New/Open Defects',
        stats: '0',
        icon: 'person',
        percent: '80'

      }, {
        color: pieColor,
        description: 'In Progress',
        stats: '0',
        icon: 'money',
      }, {
        color: pieColor,
        description: 'Fixed',
        stats: '0',
        icon: 'face',
      }, {
        color: pieColor,
        description: 'Closed',
        stats: '0',
        icon: 'refresh',
      }
    ];*/
  }
}
