import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';
import {ALMService} from '../../../alm.service';

@Injectable()
export class PieChartService {
  constructor(private _baConfig:BaThemeConfigProvider, private _almService:ALMService) {
  }

  getData(input) {
    this.defectsStats = [];

    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;

    if (input != null && input != undefined) {
      for (let entry of input) {
        this.defectsStats.push({
          color: pieColor,
          description: entry.description,
          stats: entry.stats,
          icon: 'person',
        });
      }
      return this.defectsStats;

    } else {
      return[
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
          stats: 0,
          icon: 'face',
        }, {
          color: pieColor,
          description: 'Closed',
          stats: '0',
          icon: 'refresh',
        }
      ];
    }

  }
}
