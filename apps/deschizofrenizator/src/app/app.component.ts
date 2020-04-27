import { Component, HostListener, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { PerunPrincipal } from '@perun-web-apps/perun/openapi';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { environment } from '../../../admin-gui/src/environments/environment';

@Component({
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public static minWidth = 992;

  title = 'deschizofrenizator';

  constructor(private store: StoreService) {
    this.getScreenSize(null);
  }



  lastScreenWidth: number;

  principal: PerunPrincipal;
  isProduction = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.lastScreenWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return window.innerWidth <= AppComponent.minWidth;
  }

  ngOnInit(): void {
    this.isProduction = environment.production;
    this.principal = this.store.getPerunPrincipal();
  }

}
