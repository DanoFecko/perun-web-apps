import { Component, OnInit } from '@angular/core';
import { MembersManagerService, RichMember } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { TABLE_VO_MEMBERS } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { CreateSponsoredUserDialogComponent } from '../../../../../shared/components/dialogs/create-sponsored-user-dialog/create-sponsored-user-dialog.component';
import { DeleteSponsoredUserDialogComponent } from '../../../../../shared/components/dialogs/delete-sponsored-user-dialog/delete-sponsored-user-dialog.component';

@Component({
  selector: 'app-vo-settings-sponsored-user',
  templateUrl: './vo-settings-sponsored-user.component.html',
  styleUrls: ['./vo-settings-sponsored-user.component.scss']
})
export class VoSettingsSponsoredUserComponent implements OnInit {

  constructor(private membersManager: MembersManagerService,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  voId: number;
  members: RichMember[] = [];

  selection = new SelectionModel<RichMember>(true, []);
  searchString = '';
  loading = false;
  statuses = new FormControl();
  statusList = ['VALID', 'INVALID', 'SUSPENDED', 'EXPIRED', 'DISABLED'];
  selectedStatuses: string[] = ['VALID', 'INVALID', 'SUSPENDED', 'EXPIRED', 'DISABLED'];
  pageSize: number;
  tableId = TABLE_VO_MEMBERS;

  ngOnInit(): void {
    this.loading = true;
    this.route.parent.parent.params.subscribe(parentParentParams => {
      this.voId = parentParentParams ['voId'];
      this.membersManager.getSponsoredMembers(this.voId).subscribe(members => {
        this.members = members;
        this.loading = false;
      });
    });
  }

  onCreate(): void {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      entityId: this.voId,
      voId: this.voId,
      theme: 'vo-theme'
    };

    const dialogRef = this.dialog.open(CreateSponsoredUserDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  onDelete() {
    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      entityId: this.voId,
      voId: this.voId,
      theme: 'vo-theme',
      members: this.selection.selected
    };

    const dialogRef = this.dialog.open(DeleteSponsoredUserDialogComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      this.refresh();
    });
  }

  refresh() {
    this.ngOnInit();
  }

  applyFilter(filterValue: string) {
    this.searchString = filterValue;
  }
}
