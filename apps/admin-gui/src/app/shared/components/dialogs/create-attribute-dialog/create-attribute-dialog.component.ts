import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttrEntity } from '@perun-web-apps/perun/models';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TableConfigService, TABLE_ATTRIBUTES_SETTINGS } from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';

export interface CreateAttributeDialogData {
  entityId: number;
  notEmptyAttributes: Attribute[];
  style?: string;
  entity: AttrEntity;
  secondEntity?: AttrEntity;
  secondEntityId?: number;
}

@Component({
  selector: 'app-create-attribute-dialog',
  templateUrl: './create-attribute-dialog.component.html',
  styleUrls: ['./create-attribute-dialog.component.scss']
})

export class CreateAttributeDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateAttributeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CreateAttributeDialogData,
              private attributesManager: AttributesManagerService,
              private notificator: NotificatorService,
              private tableConfigService: TableConfigService,
              private translate: TranslateService) {
    this.translate.get('DIALOGS.CREATE_ATTRIBUTE.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
  }

  @ViewChild('list')
  list: AttributesListComponent;

  attributes: Attribute[];
  selected = new SelectionModel<Attribute>(true, []);
  saveSuccessMessage: string;
  showError = false;
  filterValue = '';
  tableId = TABLE_ATTRIBUTES_SETTINGS;
  pageSize: number;
  loading: boolean;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    const unWanted = new Array<number>();
    this.data.notEmptyAttributes.forEach(attribute => {
      unWanted.push(attribute.id);
    });

    let memberId: number;
    let userId: number;
    let voId: number;
    let groupId: number;
    let resourceId: number;
    let facilityId: number;
    let hostId: number;
    let uesId: number;

    switch (this.data.entity) {
      case 'member':
        memberId = this.data.entityId;
        break;
      case 'user':
        userId = this.data.entityId;
        break;
      case 'vo':
        voId = this.data.entityId;
        break;
      case 'group':
        groupId = this.data.entityId;
        break;
      case 'resource':
        resourceId = this.data.entityId;
        break;
      case 'facility':
        facilityId = this.data.entityId;
        break;
      case 'host':
        hostId = this.data.entityId;
        break;
      case 'ues':
        uesId = this.data.entityId;
        break;
    }
    switch (this.data.secondEntity) {
      case 'member':
        memberId = this.data.secondEntityId;
        break;
      case 'user':
        userId = this.data.secondEntityId;
        break;
      case 'vo':
        voId = this.data.secondEntityId;
        break;
      case 'group':
        groupId = this.data.secondEntityId;
        break;
      case 'resource':
        resourceId = this.data.secondEntityId;
        break;
      case 'facility':
        facilityId = this.data.secondEntityId;
        break;
      case 'host':
        hostId = this.data.secondEntityId;
        break;
      case 'ues':
        uesId = this.data.secondEntityId;
        break;
    }
    this.loading = true;
    this.attributesManager.getAttributesDefinitionWithRights(memberId, userId, voId, groupId, resourceId, facilityId,
      hostId, uesId).subscribe(attributes => {
      this.attributes = attributes as Attribute[];
      this.attributes = this.attributes.filter(attribute => {
        return !unWanted.includes(attribute.id) && this.twoEntityValid(attribute);
      });
      this.attributes = this.attributes;
      this.loading = false;
    });
  }

  private twoEntityValid(attribute: Attribute) {
    if (!this.data.secondEntity) {
      return true;
    }
    return attribute.entity === `${this.data.entity}_${this.data.secondEntity}`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.list.updateMapAttributes();
    let containsEmpty = false;
    for (const attribute of this.selected.selected) {
      if (attribute.type === 'java.util.ArrayList' && (<Array<any>>attribute.value).length === 0) {
        containsEmpty = true;
      }
      if (attribute.value === undefined) {
        containsEmpty = true;
      }
    }
    if (containsEmpty) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 5000);
      return;
    }

    switch (this.data.entity) {
      case 'facility':
        this.attributesManager.setFacilityAttributes({
          facility: this.data.entityId,
          attributes: this.selected.selected
        }).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'group':
        switch (this.data.secondEntity) {
          case 'resource':
            this.attributesManager.setGroupResourceAttributes({
              group: this.data.entityId,
              resource: this.data.secondEntityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
            break;
          default:
            this.attributesManager.setGroupAttributes({
              group: this.data.entityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
        }
        break;
      case 'member':
        switch (this.data.secondEntity) {
          case 'resource':
            this.attributesManager.setMemberResourceAttributes({
              member: this.data.entityId,
              resource: this.data.secondEntityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
            break;
          case 'group':
            this.attributesManager.setMemberGroupAttributes({
              member: this.data.entityId,
              group: this.data.secondEntityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
            break;
          default:
            this.attributesManager.setMemberAttributes({
              member: this.data.entityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
        }
        break;
      case 'resource':
        this.attributesManager.setResourceAttributes({
          resource: this.data.entityId,
          attributes: this.selected.selected
        }).subscribe(() => {
          this.handleSuccess();
        });
        break;
      case 'user':
        switch (this.data.secondEntity) {
          case 'facility':
            this.attributesManager.setUserFacilityAttributes({
              user: this.data.entityId,
              facility: this.data.secondEntityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
            break;
          default:
            this.attributesManager.setUserAttributes({
              user: this.data.entityId,
              attributes: this.selected.selected
            }).subscribe(() => {
              this.handleSuccess();
            });
        }
        break;
      case 'vo':
        this.attributesManager.setVoAttributes({
          vo: this.data.entityId,
          attributes: this.selected.selected
        }).subscribe(() => {
          this.handleSuccess();
        });
        break;
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  handleSuccess() {
    this.notificator.showSuccess(this.saveSuccessMessage);
    this.selected.clear();
    this.dialogRef.close('saved');
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}

