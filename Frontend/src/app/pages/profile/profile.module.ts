import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { ConfigService } from '../../common/config.service';
import { Profile } from './profile.component';
import { routing } from './profile.routing';
import { TrafficChart } from './../../common/trafficChart';
import { TrafficChartService } from './../../common/trafficChart/trafficChart.service';
import { BaContentTop } from '../../theme/components/baContentTop/baContentTop.component'

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
    
  ],
  declarations: [
    Profile,
    TrafficChart
  ],
  providers: [
    TrafficChartService,
    BaContentTop
  ]
})
export class ProfileModule { }
