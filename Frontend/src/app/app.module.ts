import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './auth.service';
import { ConfigService } from './common/config.service';

/*HTTP Modules*/
import { HttpModule, XHRBackend, Http, ResponseOptions, XSRFStrategy, BrowserXhr } from '@angular/http';
import { HttpInterceptor } from './common/http-interceptor.service';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};
export function httpFactory(browserXHR: BrowserXhr, requestOptions: ResponseOptions, xsrfStrategy: XSRFStrategy, configService: ConfigService, router: Router) {
  return new HttpInterceptor(browserXHR, requestOptions, xsrfStrategy, configService, router);
}

export function authConfigLoader(authConfig: AuthService) {
  return () => authConfig.loadAuthConfig();
}


@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    AuthService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: authConfigLoader,
      deps: [AuthService],
      multi: true
    },
    {
      provide: XHRBackend,
      useFactory: httpFactory,
      deps: [BrowserXhr, ResponseOptions, XSRFStrategy, ConfigService, Router]
    }
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
