import { Injectable } from '@angular/core';
import { InitAuthService, StoreService } from '@perun-web-apps/perun/services';
import { AppConfigService, ColorConfig, EntityColorConfig } from '@perun-web-apps/config';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';

@Injectable({
  providedIn: 'root'
})
export class DeschizConfigService {

  constructor(
    private initAuthService: InitAuthService,
    private appConfigService: AppConfigService,
    private store: StoreService,
    private authzSevice: AuthzResolverService
  ) {}

  entityColorConfigs: EntityColorConfig[] = [
    {
      entity: 'user',
      configValue: 'user_color',
      cssVariable: '--user-color'
    }
  ];

  colorConfigs: ColorConfig[] = [
    {
      configValue: 'sidemenu_bg_color',
      cssVariable: '--side-bg'
    },
    {
      configValue: 'sidemenu_hover_color',
      cssVariable: '--side-hover'
    },
    {
      configValue: 'sidemenu_active_color',
      cssVariable: '--side-active'
    },
    {
      configValue: 'sidemenu_active_text_color',
      cssVariable: '--side-text-active'
    }
  ];

  loadConfigs(): Promise<void> {
    return this.appConfigService.loadAppDefaultConfig()
      .then(() => this.appConfigService.loadAppInstanceConfig())
      .then(() => this.setApiUrl())
      //.then(() => this.appConfigService.initializeColors(this.entityColorConfigs, this.colorConfigs))
      .then(() => this.initAuthService.authenticateUser())
      .then(() => this.initAuthService.loadPrincipal());
  }

  /**
   *  We need to set basePath for authzService before loading principal, otherwise authzService uses its default basePath
   */
  private setApiUrl() {
    return new Promise((resolve) => {
      this.authzSevice.configuration.basePath = this.store.get('api_url');
      resolve();
    });
  }
}
