import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../common/config.service';
import { TrafficChart } from './../../common/trafficChart';
import { BaContentTop } from '../../theme/components/baContentTop/baContentTop.component'

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile {
  public currentResource: any;
  constructor(private _configService: ConfigService, private _baContentTop: BaContentTop) {
  }
  ngOnInit() {
    this.getCurrentResource();
  }
  getCurrentResource() {
    this.currentResource = this._configService.CurrentResource;
    this._baContentTop.setTitle(this.currentResource.name + " Profile") ;
  }

}
