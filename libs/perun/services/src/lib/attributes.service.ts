import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { PerunApiService } from './perun-api-service';
import { Attribute, AttributeDefinition, AttributeRights, AttrEntity, Graph } from '@perun-web-apps/perun/models';


@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor(
    @Inject(PERUN_API_SERVICE) private apiService: PerunApiService
  ) {
  }

  getAttribute(entityId: number, entity: AttrEntity, urn: string, showNotificationOnError = true): Observable<Attribute> {
    return this.apiService.get(`json/attributesManager/getAttribute?${entity}=${entityId}&attributeName=${urn}`,
      new HttpParams(), showNotificationOnError);
  }

  setAttribute(entityId: number, entity: AttrEntity, attribute: Attribute, showNotificationOnError = true): Observable<void> {
    const payload = {};
    payload[entity] = entityId;
    payload['attribute'] = attribute;

    return this.apiService.post(`json/attributesManager/setAttribute`, payload, showNotificationOnError);
  }

  getAttributeModulesDependenciesGraphText(format: string, showNotificationOnError = true): Observable<Graph> {
    return this.apiService.get(`json/attributesManager/getAttributeModulesDependenciesGraphText?format=${format}`,
      new HttpParams(), showNotificationOnError);
  }

  getAttributesDefinition(showNotificationOnError = true): Observable<AttributeDefinition[]> {
    return this.apiService.get('json/attributesManager/getAttributesDefinition',
      new HttpParams(), showNotificationOnError);
  }

  getAllAttributes(entityId: number, entity: AttrEntity, showNotificationOnError = true): Observable<Attribute[]> {
    return this.apiService.get(`json/attributesManager/getAttributes?${entity}=${entityId}`, new HttpParams(), showNotificationOnError);
  }

  deleteAttributes(entityId: number, entity: AttrEntity, attributeIDs: number[], showNotificationOnError = true) {
    const payload = {};
    payload[entity] = entityId;
    payload['attributes'] = attributeIDs;

    return this.apiService.post('json/attributesManager/removeAttributes', payload, showNotificationOnError);
  }

  getAttributeDefinitions(voId: number, entity: string, showNotificationOnError = true): Observable<AttributeDefinition[]> {
    return this.apiService.get(`json/attributesManager/getAttributesDefinitionWithRights?${entity}=${voId}`,
      new HttpParams(), showNotificationOnError);
  }

  setAttributes(entityId: number, entity: AttrEntity, attributes: Attribute[], showNotificationOnError = true): Observable<number> {
    const payload = {};
    payload[entity] = entityId;
    payload['attributes'] = attributes;

    return this.apiService.post('json/attributesManager/setAttributes', payload, showNotificationOnError);
  }

  getAttributes(entityId: number, entity: AttrEntity, attributes: string[], showNotificationOnError = true): Observable<Attribute[]> {
    const payload = {};
    payload[entity] = entityId;
    payload['attrNames'] = attributes;

    return this.apiService.post('json/attributesManager/getAttributes', payload, showNotificationOnError);
  }

  deleteAttributeDefinitions(attributeDefIds: number[], showNotificationOnError = true) {
    const payload = {};
    payload['attributes'] = attributeDefIds;

    return this.apiService.post('json/attributesManager/deleteAttributes', payload, showNotificationOnError);
  }

  createAttributeDefinition(attrDef: AttributeDefinition, showNotificationOnError = true): Observable<AttributeDefinition> {
    const payload = {};
    payload['attribute'] = attrDef;

    return this.apiService.post('json/attributesManager/createAttribute', payload, showNotificationOnError);
  }

  setAttributesRights(rights: AttributeRights[], showNotificationOnError = true) {
    const payload = {};
    payload['rights'] = rights;

    return this.apiService.post('json/attributesManager/setAttributeRights', payload, showNotificationOnError);
  }


  getAttributeRights(attId: number, showNotificationOnError = true): Observable<AttributeRights[]> {
    return this.apiService.get(`json/attributesManager/getAttributeRights?attributeId=${attId}`, new HttpParams(), showNotificationOnError);
  }

  updateAttributeDefinition(attDef: AttributeDefinition, showNotificationOnError = true): Observable<AttributeDefinition> {
    const payload = {};
    payload['attributeDefinition'] = attDef;

    return this.apiService.post('json/attributesManager/updateAttributeDefinition', payload, showNotificationOnError);
  }

  getEntitylessAttributes(attName: string, showNotificationOnError = true): Observable<Attribute[]> {
    return this.apiService.get(`json/attributesManager/getEntitylessAttributes?attrName=${attName}`,
      new HttpParams(), showNotificationOnError);
  }

  getEntitylessKeys(attDefId: number, showNotificationOnError = true): Observable<string[]> {
    return this.apiService.get(`json/attributesManager/getEntitylessKeys?attributeDefinition=${attDefId}`,
      new HttpParams(), showNotificationOnError);
  }

  setEntitylessAttribute(key: string, att: Attribute, showNotificationOnError = true): Observable<void> {
    const payload = {};
    payload['key'] = key;
    payload['attribute'] = att;

    return this.apiService.post('json/attributesManager/setAttribute', payload, showNotificationOnError)
  }

  removeEntitylessAttribute(key: string, attId: number, showNotificationOnError = true): Observable<void> {
    const payload = {};
    payload['key'] = key;
    payload['attribute'] = attId;

    return this.apiService.post('json/attributesManager/removeAttribute', payload, showNotificationOnError)
  }
}

