import { Inject, Injectable } from '@angular/core';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from '@perun-web-apps/perun/services';
import { Observable } from 'rxjs';
import { ExtSource } from '@perun-web-apps/perun/models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtSourceService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) {
  }

  getExtSources(showNotificationOnError = true): Observable<ExtSource[]> {
    return this.apiService.get('json/extSourcesManager/getExtSources', new HttpParams(), showNotificationOnError);
  }

  loadExtSources(showNotificationOnError = true): Observable<void> {
    return this.apiService.get('json/extSourcesManager/loadExtSourcesDefinitions', new HttpParams(), showNotificationOnError);
  }

  getVoExtSources(voId: number, showNotificationOnError = true): Observable<ExtSource[]> {
    return this.apiService.get(`json/extSourcesManager/getVoExtSources?vo=${voId}`, new HttpParams(), showNotificationOnError);
  }

  addExtSources(voId: number, extSourceId: number, showNotificationOnError = true): Observable<void> {
    const payload = {
      vo: voId,
      source: extSourceId
    };

    return this.apiService.post('json/extSourcesManager/addExtSource', payload, showNotificationOnError);
  }

  removeExtSources(voId: number, extSourceId: number, showNotificationOnError = true): Observable<void> {
    const payload = {
      vo: voId,
      source: extSourceId
    };

    return this.apiService.post('json/extSourcesManager/removeExtSource', payload, showNotificationOnError);
  }

}
