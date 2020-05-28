import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceConfiguratorComponent } from './service-configurator/service-configurator.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { TranslateModule } from '@ngx-translate/core';
import { UiMaterialModule } from '@perun-web-apps/ui/material';

@NgModule({
  imports: [CommonModule, MatTabsModule, PerunSharedComponentsModule, TranslateModule, UiMaterialModule],
  declarations: [ServiceConfiguratorComponent],
  exports: [ServiceConfiguratorComponent]
})
export class PerunFacilityServicesConfigModule {}
