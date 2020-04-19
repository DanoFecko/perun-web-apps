import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FirstGroupComponent } from './components/first-group/first-group.component';
import { SecondGroupComponent } from './components/second-group/second-group.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent, FirstGroupComponent, SecondGroupComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
