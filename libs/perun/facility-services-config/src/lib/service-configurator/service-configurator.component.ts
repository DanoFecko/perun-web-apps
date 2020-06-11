import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  Facility,
  Group,
  Resource,
  RichMember,
  Service
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_ATTRIBUTES_SETTINGS,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';
import { AttributesListComponent, EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

export type ServiceSelectValue = 'ALL' | 'NOT_SELECTED';

@Component({
  selector: 'perun-web-apps-service-configurator',
  templateUrl: './service-configurator.component.html',
  styleUrls: ['./service-configurator.component.scss']
})
export class ServiceConfiguratorComponent implements OnInit, OnChanges {

  constructor(
    private attributesManager: AttributesManagerService,
    private tableConfigService: TableConfigService,
    private dialog: MatDialog
  ) {
  }

  @Input()
  facility: Facility;

  @Input()
  service: Service | ServiceSelectValue;

  @Input()
  resource: Resource;

  @Input()
  group: Group;

  @Input()
  member: RichMember;

  @ViewChild('FacilityAList')
  facilityAlist: AttributesListComponent;
  @ViewChild('ResourceAList')
  resourceAList: AttributesListComponent;
  @ViewChild('GroupAList')
  groupAList: AttributesListComponent;
  @ViewChild('MemberAList')
  memberAList: AttributesListComponent;


  selectionFacility = new SelectionModel<Attribute>(true, []);
  selectionResource = new SelectionModel<Attribute>(true, []);
  selectionGroup = new SelectionModel<Attribute>(true, []);
  selectionMember = new SelectionModel<Attribute>(true, []);


  showTab = 0;

  facilityAttributes: Attribute[];
  resourceAttributes: Attribute[];
  groupAttributes: Attribute[];
  memberAttributes: Attribute[];

  tableId = TABLE_ATTRIBUTES_SETTINGS;
  pageSize: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.loadFacilityAttributes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service']) {
      this.reloadAll();
      return;
    }
    if (changes['resource']) {
      if (changes['resource'].currentValue === undefined) {
        this.resourceAttributes = undefined;
        this.showTab = 0;
      } else {
        this.showTab = 1;
        this.loadResourceAttributes();
      }
    } else if (changes['group']) {
      if (changes['group'].currentValue === undefined) {
        this.groupAttributes = undefined;
        this.showTab = 1;
      } else {
        this.showTab = 2;
        this.attributesManager.getGroupAttributes(this.group.id).subscribe(attrs => this.groupAttributes = attrs);
      }
    } else if (changes['member']) {
      if (changes['member'].currentValue === undefined) {
        this.memberAttributes = undefined;
        this.showTab = 2;
      } else {
        this.showTab = 3;
        this.attributesManager.getMemberAttributes(this.member.id).subscribe(attrs => this.memberAttributes = attrs);
      }
    }

  }

  loadResourceAttributes() {
    if (this.service === 'NOT_SELECTED') {
      this.attributesManager
        .getResourceAttributes(this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    } else if (this.service === 'ALL') {
      this.attributesManager
        .getRequiredAttributesResource(this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    } else {
      this.attributesManager
        .getRequiredAttributesResourceService(this.service.id, this.resource.id)
        .subscribe(attrs => this.resourceAttributes = attrs);
    }
  }

  loadFacilityAttributes() {
    if (this.service === 'NOT_SELECTED') {
      this.attributesManager
        .getFacilityAttributes(this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    } else if (this.service === 'ALL') {
      this.attributesManager
        .getRequiredAttributesFacility(this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    } else {
      this.attributesManager
        .getRequiredAttributesFacilityService(this.service.id, this.facility.id)
        .subscribe(attrs => this.facilityAttributes = attrs);
    }
  }

  private reloadAll() {
    this.loadFacilityAttributes();
    if (this.resource !== undefined) {
      this.loadResourceAttributes();
    }
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }

  onSaveFacility() {
    this.facilityAlist.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.facility.id,
        entity: 'facility',
        attributes: this.selectionFacility.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionFacility.clear()
        this.ngOnInit()
      }
    });
  }

  onSaveResource() {
    this.resourceAList.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.resource.id,
        entity: 'resource',
        attributes: this.selectionResource.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionResource.clear()
        this.ngOnInit()
      }
    });
  }

  onSaveGroup() {
    this.groupAList.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.group.id,
        entity: 'group',
        attributes: this.selectionGroup.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionGroup.clear()
        this.ngOnInit()
      }
    });
  }

  onSaveMember() {
    this.memberAList.updateMapAttributes();

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.member.id,
        entity: 'member',
        attributes: this.selectionMember.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionMember.clear()
        this.ngOnInit()
      }
    });
  }
}
