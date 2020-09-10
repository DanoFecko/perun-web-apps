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
import { MemberAllOf } from './memberAllOf';


export interface Member extends Auditable { 
    userId?: number;
    voId?: number;
    status?: string;
    membershipType?: string;
    sourceGroupId?: number;
    sponsored?: boolean;
    suspendedTo?: string;
    suspended?: boolean;
    groupStatus?: string;
    groupStatuses?: { [key: string]: string; };
}

