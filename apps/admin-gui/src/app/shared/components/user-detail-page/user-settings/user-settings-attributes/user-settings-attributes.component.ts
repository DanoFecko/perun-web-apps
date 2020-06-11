import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateAttributeDialogComponent } from '../../../dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { DeleteAttributeDialogComponent } from '../../../dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import {
  TABLE_ATTRIBUTES_SETTINGS,
  TableConfigService
} from '@perun-web-apps/config/table-config';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-settings-attributes',
  templateUrl: './user-settings-attributes.component.html',
  styleUrls: ['./user-settings-attributes.component.scss']
})
export class UserSettingsAttributesComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private attributesManager: AttributesManagerService,
    private notificator: NotificatorService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private tableConfigService: TableConfigService,
    private store: StoreService
  ) {
    this.translate.get('USER_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
    this.translate.get('USER_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
  }

  @ViewChild('list')
  list: AttributesListComponent;

  saveSuccessMessage: string;
  deleteSuccessMessage: string;
  selection = new SelectionModel<Attribute>(true, []);
  attributes: Attribute[] = [];
  userId: number;

  loading: boolean;
  filterValue = '';

  tableId = TABLE_ATTRIBUTES_SETTINGS;
  pageSize: number;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    this.route.parent.parent.params.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId === undefined) {
        this.userId = this.store.getPerunPrincipal().userId;
      }

      this.refreshTable();
    });
  }

  onCreate() {
    const config = getDefaultDialogConfig();
    config.width = '1050px';
    config.data = {
      entityId: this.userId,
      entity: 'user',
      notEmptyAttributes: this.attributes,
      style: 'user-theme'
    };

    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onSave() {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();

    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.userId,
      entity: 'user',
      attributes: this.selection.selected
    };

    const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onDelete() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      entityId: this.userId,
      entity: 'user',
      attributes: this.selection.selected
    };

    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);

    dialogRef.afterClosed().subscribe(didConfirm => {
      if (didConfirm) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    // TODO Does not apply filter on refresh.
    this.loading = true;
    this.attributesManager.getUserAttributes(this.userId).subscribe(attributes => {
      this.attributes = attributes;
      this.selection.clear();
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
}
