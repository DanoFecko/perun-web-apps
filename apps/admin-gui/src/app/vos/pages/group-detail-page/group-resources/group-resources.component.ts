import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Group, GroupsManagerService, ResourcesManagerService, RichResource } from '@perun-web-apps/perun/openapi';
import { PageEvent } from '@angular/material/paginator';
import { TableConfigService, TABLE_GROUP_RESOURCES_LIST } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupResourceDialogComponent } from '../../../../shared/components/dialogs/add-group-resource-dialog/add-group-resource-dialog.component';
import { RemoveGroupResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-resource-dialog/remove-group-resource-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-group-resources',
  templateUrl: './group-resources.component.html',
  styleUrls: ['./group-resources.component.scss']
})
export class GroupResourcesComponent implements OnInit {

  static id = 'GroupResourcesComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(private resourcesManager: ResourcesManagerService,
              private groupService: GroupsManagerService,
              private tableConfigService: TableConfigService,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  group: Group;
  resources: RichResource[] = null;
  selected = new SelectionModel<RichResource>(true, []);

  loading: boolean;
  filterValue = '';
  pageSize: number;
  tableId = TABLE_GROUP_RESOURCES_LIST;

  groupId: number;
  voId: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);

    this.route.parent.params.subscribe(parentParams => {
      this.groupId = parentParams['groupId'];
      this.voId = parentParams['voId'];

      this.groupService.getGroupById(this.groupId).subscribe(group => {
        this.group = group;

        this.refreshTable();
      });
    });
  }

  refreshTable() {
    this.loading = true;
    this.resourcesManager.getAssignedRichResourcesWithGroup(this.group.id).subscribe(resources => {
      this.resources = resources;
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }

  addResource() {
    const config = getDefaultDialogConfig();
    config.width = '750px';
    config.data = {theme: 'group-theme', groupId: this.groupId, voId: this.voId, unwantedResources: this.resources.map(res => res.id)};

    const dialogRef = this.dialog.open(AddGroupResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  removeResource() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {theme: 'group-theme', resources: this.selected.selected, groupId: this.groupId};

    const dialogRef = this.dialog.open(RemoveGroupResourceDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selected.clear();
        this.refreshTable();
      }
    });
  }
}
