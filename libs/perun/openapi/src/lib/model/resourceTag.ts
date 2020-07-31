/**
 * Perun RPC API
 * Perun Remote Procedure Calls Application Programming Interface
 *
 * The version of the OpenAPI document: 3.10.0
 * Contact: perun@cesnet.cz
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Auditable } from './auditable';
import { ResourceTagAllOf } from './resourceTagAllOf';


export interface ResourceTag extends Auditable { 
    tagName?: string;
    voId?: number;
}

