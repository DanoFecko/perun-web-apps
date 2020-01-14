import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { NotificatorService } from '../../../../core/services/common/notificator.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionType, AttributeDefinition, AttributeRights, Role, Service } from '@perun-web-apps/perun/models';
import { AttributesService, ServiceService } from '@perun-web-apps/perun/services';
import { slideInOutLeft, slideInOutRight, switchAnimation } from '../../../animations/Animations';

export interface EditAttributeDefinitionDialogData {
  attDef: AttributeDefinition;
}

@Component({
  selector: 'app-edit-attribute-definition-dialog',
  templateUrl: './edit-attribute-definition-dialog.component.html',
  styleUrls: ['./edit-attribute-definition-dialog.component.scss'],
  animations: [switchAnimation, slideInOutLeft, slideInOutRight]
})
export class EditAttributeDefinitionDialogComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<EditAttributeDefinitionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EditAttributeDefinitionDialogData,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private attributeService: AttributesService,
              private serviceService: ServiceService) {
  }

  showKeys = false;

  activatedComponent = 'Edit';

  attDef: AttributeDefinition;
  services: Service[];

  readSelf = false;
  readSelfPublic = false;
  readSelfVo = false;
  readVo = false;
  readGroup = false;
  readFacility = false;

  writeSelf = false;
  writeSelfPublic = false;
  writeSelfVo = false;
  writeVo = false;
  writeGroup = false;
  writeFacility = false;

  ngOnInit() {
    this.dialogRef.addPanelClass('mat-dialog-height-transition');
    this.attDef = this.data.attDef;
    this.serviceService.getServicesByAttributeDefinition(this.attDef.id).subscribe(response => {
      this.services = response;
    });
    this.attributeService.getAttributeRights(this.attDef.id).subscribe(response => {
      this.fromRightsToCheckboxes(response);
    });
  }

  disableConfirmButton(): boolean {
    return (this.attDef.displayName === '' || this.attDef.description === '');
  }

  disableUniqueToggle(): boolean {
    return (this.attDef.namespace.includes('virt') || this.attDef.namespace.includes('core') || this.attDef.entity === 'entityless');
  }

  onSubmit() {
    this.attributeService.updateAttributeDefinition(this.attDef).subscribe(attDef => {
      this.attDef = attDef;
      this.attributeService.setAttributesRights(this.fromCheckboxesToRights()).subscribe(() => {
        this.translate.get('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.SUCCESS').subscribe(successMessage => {
          this.notificator.showSuccess(successMessage);
          this.dialogRef.close(true);
        });
      });
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  fromCheckboxesToRights(): AttributeRights[] {
    const list: AttributeRights[] = [];

    const rightsSELF = {} as AttributeRights;
    rightsSELF.attributeId = this.attDef.id;
    rightsSELF.role = Role.SELF;
    rightsSELF.rights = [];

    if (this.readSelf) {
      rightsSELF.rights.push(ActionType.READ);
    }
    if (this.readSelfPublic) {
      rightsSELF.rights.push(ActionType.READ_PUBLIC);
    }
    if (this.readSelfVo) {
      rightsSELF.rights.push(ActionType.READ_VO);
    }

    if (this.writeSelf) {
      rightsSELF.rights.push(ActionType.WRITE);
    }
    if (this.writeSelfPublic) {
      rightsSELF.rights.push(ActionType.WRITE_PUBLIC);
    }
    if (this.writeSelfVo) {
      rightsSELF.rights.push(ActionType.WRITE_VO);
    }

    list.push(rightsSELF);

    const rightsVO = {} as AttributeRights;
    rightsVO.attributeId = this.attDef.id;
    rightsVO.role = Role.VOADMIN;
    rightsVO.rights = [];

    if (this.readVo) {
      rightsVO.rights.push(ActionType.READ);
    }

    if (this.writeVo) {
      rightsVO.rights.push(ActionType.WRITE);
    }

    list.push(rightsVO);

    const rightsGROUP = {} as AttributeRights;
    rightsGROUP.attributeId = this.attDef.id;
    rightsGROUP.role = Role.GROUPADMIN;
    rightsGROUP.rights = [];

    if (this.readGroup) {
      rightsGROUP.rights.push(ActionType.READ);
    }

    if (this.writeGroup) {
      rightsGROUP.rights.push(ActionType.WRITE);
    }

    list.push(rightsGROUP);

    const rightsFACILITY = {} as AttributeRights;
    rightsFACILITY.attributeId = this.attDef.id;
    rightsFACILITY.role = Role.FACILITYADMIN;
    rightsFACILITY.rights = [];

    if (this.readFacility) {
      rightsFACILITY.rights.push(ActionType.READ);
    }

    if (this.writeFacility) {
      rightsFACILITY.rights.push(ActionType.WRITE);
    }

    list.push(rightsFACILITY);

    return list;
  }

  fromRightsToCheckboxes(rights: AttributeRights[]) {
    for (const right of rights) {
      switch (right.role) {
        case Role.SELF: {
          if (right.rights.includes(ActionType.READ)) {
            this.readSelf = true;
          }
          if (right.rights.includes(ActionType.READ_PUBLIC)) {
            this.readSelfPublic = true;
          }
          if (right.rights.includes(ActionType.READ_VO)) {
            this.readSelfVo = true;
          }
          if (right.rights.includes(ActionType.WRITE)) {
            this.writeSelf = true;
          }
          if (right.rights.includes(ActionType.WRITE_PUBLIC)) {
            this.writeSelfPublic = true;
          }
          if (right.rights.includes(ActionType.WRITE_VO)) {
            this.writeSelfVo = true;
          }
          break;
        }
        case Role.GROUPADMIN: {
          if (right.rights.includes(ActionType.READ)) {
            this.readGroup = true;
          }
          if (right.rights.includes(ActionType.WRITE)) {
            this.writeGroup = true;
          }
          break;
        }
        case Role.FACILITYADMIN: {
          if (right.rights.includes(ActionType.READ)) {
            this.readFacility = true;
          }
          if (right.rights.includes(ActionType.WRITE)) {
            this.writeFacility = true;
          }
          break;
        }
        case Role.VOADMIN: {
          if (right.rights.includes(ActionType.READ)) {
            this.readVo = true;
          }
          if (right.rights.includes(ActionType.WRITE)) {
            this.writeVo = true;
          }
          break;
        }
      }
    }
  }

  switchShowKeys() {
    this.showKeys = !this.showKeys;
    if (this.showKeys) {
      this.dialogRef.updateSize('800px');
      this.activatedComponent = 'Entityless';
    } else {
      this.dialogRef.updateSize('700px');
      this.activatedComponent = 'Edit';
    }
  }
}
