import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {SideMenuService} from '../../../../../core/services/common/side-menu.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificatorService} from '../../../../../core/services/common/notificator.service';
import {TranslateService} from '@ngx-translate/core';
import {AttributesListComponent} from '../../../../../shared/components/attributes-list/attributes-list.component';
import {SelectionModel} from '@angular/cdk/collections';
import {filterCoreAttributes} from '../../../../../shared/utils';
import {
  DeleteAttributeDialogComponent
} from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import {
  CreateAttributeDialogComponent
} from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { AttributesService } from '@perun-web-apps/perun/services';
import { Attribute } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-resource-settings-attributes',
  templateUrl: './resource-settings-attributes.component.html',
  styleUrls: ['./resource-settings-attributes.component.scss']
})
export class ResourceSettingsAttributesComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(private attributesService: AttributesService,
              private sideMenuService: SideMenuService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private notificator: NotificatorService,
              private translate: TranslateService) {
    this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
    this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
  }

  @ViewChild('list', {static: false})
  list: AttributesListComponent;

  attributes: Attribute[] = [];
  selection = new SelectionModel<Attribute>(true, []);
  resourceId: number;
  saveSuccessMessage: string;
  deleteSuccessMessage: string;

  loading: boolean;
  filterValue = '';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(params => {
      this.resourceId = params['resourceId'];
      this.refreshTable();
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, {
      width: '450px',
      data: {
        entityId: this.resourceId,
        entity: 'resource',
        attributes: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  onSave() {
    // have to use this to update attribute with map in it, before saving it
    this.list.updateMapAttributes();
    this.attributesService.setAttributes(this.resourceId, 'resource', this.selection.selected).subscribe(() => {
      this.attributesService.getAllAttributes(this.resourceId, 'resource').subscribe(attributes => {
        this.attributes = filterCoreAttributes(attributes);
        this.notificator.showSuccess(this.saveSuccessMessage);
        this.selection.clear();
      });
    });
  }

  onCreate() {
    const dialogRef = this.dialog.open(CreateAttributeDialogComponent, {
      width: '1050px',
      data: {
        entityId: this.resourceId,
        entity: 'resource',
        notEmptyAttributes: this.attributes,
        style: 'resource-theme'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
       this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.attributesService.getAllAttributes(this.resourceId, 'resource').subscribe(attributes => {
      this.attributes = filterCoreAttributes(attributes);
      this.selection.clear();
      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
   this.filterValue = filterValue;
  }
}
