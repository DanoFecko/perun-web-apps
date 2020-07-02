/* tslint:disable:nx-enforce-module-boundaries */
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, forwardRef, NgModule, Provider } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FirstGroupComponent } from './components/first-group/first-group.component';
import { SecondGroupComponent } from './components/second-group/second-group.component';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { ApiInterceptor, ApiService, CustomIconService, StoreService } from '@perun-web-apps/perun/services';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatIconModule } from '@angular/material/icon';
import { GeneralModule } from '@perun-web-apps/general';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { DeschizConfigService } from './services/deschiz-config.service';
import { FlexModule } from '@angular/flex-layout';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { ThirdGroupComponent } from './components/third-group/third-group.component';
import { FourthGroupComponent } from './components/fourth-group/fourth-group.component';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.get('api_url')
  };
  return new Configuration(params);
}

const loadConfigs = (appConfig: DeschizConfigService) => {
  return () => {
    return appConfig.loadConfigs();
  };
};

@NgModule({
  declarations: [AppComponent, HomePageComponent, FirstGroupComponent, SecondGroupComponent, ThirdGroupComponent, FourthGroupComponent],
  imports: [
    BrowserModule,
    RouterModule,
    MatStepperModule,
    UiMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    GeneralModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApiModule,
    FlexModule,
    PerunSharedComponentsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [DeschizConfigService]
    },
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
      deps: [StoreService]
    },
    CustomIconService,
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService
    },
    ApiInterceptor,
    API_INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {
}
