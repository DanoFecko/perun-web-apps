import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { VoSelectTableComponent } from './vo-select-table/vo-select-table.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { RefreshButtonComponent } from './refresh-button/refresh-button.component';
import { GroupMenuComponent } from './group-menu/group-menu.component';
import { TableOptionsComponent } from './table-options/table-options.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { ImmediateFilterComponent } from './immediate-filter/immediate-filter.component';
import { AttributeValueStringComponent } from './attributes-list/attribute-value/attribute-value-string/attribute-value-string.component';
import { AttributeValueMapComponent } from './attributes-list/attribute-value/attribute-value-map/attribute-value-map.component';
import { AttributeValueListComponent } from './attributes-list/attribute-value/attribute-value-list/attribute-value-list.component';
import { AttributeValueBooleanComponent } from './attributes-list/attribute-value/attribute-value-boolean/attribute-value-boolean.component';
import { AttributeValueComponent } from './attributes-list/attribute-value/attribute-value.component';
import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { MenuButtonsFieldComponent } from './menu-buttons-field/menu-buttons-field.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
  MatRippleModule,
  NativeDateAdapter
} from '@angular/material/core';
import { AttributeValueListEditDialogComponent } from './attributes-list/attribute-value/attribute-value-list/attribute-value-list-edit-dialog/attribute-value-list-edit-dialog.component';
import { AttributeValueListDeleteDialogComponent } from './attributes-list/attribute-value/attribute-value-list/attribute-value-list-delete-dialog/attribute-value-list-delete-dialog.component';
import { PerunPipesModule } from '@perun-web-apps/perun/pipes';
import { MatDialogModule } from '@angular/material/dialog';
import { AttributeValueIntegerComponent } from './attributes-list/attribute-value/attribute-value-integer/attribute-value-integer.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { BugReportDialogComponent } from './bug-report-dialog/bug-report-dialog.component';
import { AutoFocusDirective } from '@perun-web-apps/perun/directives';
import { UserExtSourcesListComponent } from './user-ext-sources-list/user-ext-sources-list.component';
import { RemoveUserExtSourceDialogComponent } from './remove-user-ext-source-dialog/remove-user-ext-source-dialog.component';
import { EditAttributeDialogComponent } from './attributes-list/edit-attribute-dialog/edit-attribute-dialog.component';
import { CreateAttributeDialogComponent } from './create-attribute-dialog/create-attribute-dialog.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ShowValueDialogComponent } from './show-value-dialog/show-value-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { GroupSyncDetailDialogComponent } from './group-sync-detail-dialog/group-sync-detail-dialog.component';
import { GroupsTreeComponent } from './groups-tree/groups-tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { ServicesStatusListComponent } from './services-status-list/services-status-list.component';
import { ChangeExpirationDialogComponent } from './change-expiration-dialog/change-expiration-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { ForceRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { RedirectPageComponent } from './redirect-page/redirect-page.component';
import { ExtSourcesListComponent } from './ext-sources-list/ext-sources-list.component';
import { UsersMembersListComponent } from './members-list/users-members-list.component';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return date.toDateString();
  }
}

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: {
      year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatTableModule,
    FormsModule,
    MatChipsModule,
    DragDropModule,
    MatTableExporterModule,
    TranslateModule,
    RouterModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    UiAlertsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRippleModule,
    PerunPipesModule,
    MatDialogModule,
    ClipboardModule,
    MatTreeModule,
    MatDatepickerModule,
    MatRadioModule
  ],
  declarations: [
    VoSelectTableComponent,
    GroupsListComponent,
    TableOptionsComponent,
    GroupMenuComponent,
    RefreshButtonComponent,
    BackButtonComponent,
    ImmediateFilterComponent,
    AttributesListComponent,
    AttributeValueComponent,
    AttributeValueBooleanComponent,
    AttributeValueListComponent,
    AttributeValueMapComponent,
    AttributeValueStringComponent,
    ResourcesListComponent,
    MenuButtonsFieldComponent,
    AttributeValueListEditDialogComponent,
    AttributeValueListDeleteDialogComponent,
    AttributeValueIntegerComponent,
    NotificationComponent,
    NotificationDialogComponent,
    BugReportDialogComponent,
    AutoFocusDirective,
    UserExtSourcesListComponent,
    RemoveUserExtSourceDialogComponent,
    EditAttributeDialogComponent,
    CreateAttributeDialogComponent,
    PasswordResetComponent,
    ShowValueDialogComponent,
    EditGroupDialogComponent,
    GroupSyncDetailDialogComponent,
    GroupsTreeComponent,
    ServicesStatusListComponent,
    ChangeExpirationDialogComponent,
    ForceRouterLinkDirective,
    RedirectPageComponent,
    ExtSourcesListComponent,
    UsersMembersListComponent
  ],
  exports: [
    VoSelectTableComponent,
    GroupsListComponent,
    TableOptionsComponent,
    GroupMenuComponent,
    RefreshButtonComponent,
    BackButtonComponent,
    ImmediateFilterComponent,
    AttributesListComponent,
    AttributeValueComponent,
    AttributeValueBooleanComponent,
    AttributeValueListComponent,
    AttributeValueMapComponent,
    AttributeValueStringComponent,
    ResourcesListComponent,
    MenuButtonsFieldComponent,
    NotificationComponent,
    AutoFocusDirective,
    UserExtSourcesListComponent,
    RemoveUserExtSourceDialogComponent,
    EditAttributeDialogComponent,
    CreateAttributeDialogComponent,
    PasswordResetComponent,
    GroupSyncDetailDialogComponent,
    EditGroupDialogComponent,
    GroupsTreeComponent,
    ServicesStatusListComponent,
    ForceRouterLinkDirective,
    RedirectPageComponent,
    ExtSourcesListComponent,
    UsersMembersListComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PerunSharedComponentsModule {
}
