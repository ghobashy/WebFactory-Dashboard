import { Injectable } from '@angular/core';
import { BaThemeConfigProvider, colorHelper } from './../../theme';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment";
import { ConfigService } from "../../common/config.service";
@Injectable()
export class TrafficChartService {
  constructor(private _baConfig: BaThemeConfigProvider, private http: Http, private _configService: ConfigService) {
  }
  public totalScore: any = 0;
  public fullScore: number = 0;
  getData(skillMatrix: Array<object>) {
    let dashboardColors = this._baConfig.get().colors.dashboard;
    let currentResource = this._configService.CurrentResource;
    this.totalScore = 0;
    this.fullScore = 0;
    let data = new Array<object>();
    let luminosity = -0.1;
    skillMatrix.forEach((item) => {
      var scorePercentage = 0;
      if (currentResource.level == "Intermediate") {
        scorePercentage = (item["score"] / item["technology"]["intermediateScore"]) * 100;
        this.fullScore += item["technology"]["intermediateScore"];
      } else if (currentResource.level == "Senior") {
        scorePercentage = (item["score"] / item["technology"]["seniorScore"]) * 100;
        this.fullScore += item["technology"]["seniorScore"];
      } else if (currentResource.level == "Lead") {
        scorePercentage = (item["score"] / item["technology"]["leadScore"]) * 100;
        this.fullScore += item["technology"]["leadScore"];
      }
      this.totalScore += item["score"];

      var color = this.ColorLuminance('#00CCFF', luminosity);
      luminosity -= 0.04;

      data.push({
        value: item["score"],
        color: color,
        highlight: colorHelper.shade(color, 15),
        label: item["technology"]["technology"],
        percentage: scorePercentage,
        order: 1,
      });
    });
    return data;
  }

  getSkillMatrix(resourceId: any) {
    return this.http.get(environment.backendUrl + "wf/skillMatrix?resource=" + resourceId);
  }

  private getRandomColor(): String {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];

    }
    return color;
  }

  ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  }
}
