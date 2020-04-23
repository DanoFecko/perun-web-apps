import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FirstGroupComponent } from './components/first-group/first-group.component';
import { SecondGroupComponent } from './components/second-group/second-group.component';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormField } from '@angular/material/form-field';

@NgModule({
  declarations: [AppComponent, HomePageComponent, FirstGroupComponent, SecondGroupComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    MatStepperModule,
    UiMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
