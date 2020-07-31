import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MembersManagerService, RichMember } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';

export interface DeleteSponsoredUserDialogData {
  entityId?: number
  voId?: number;
  theme: string,
  members: RichMember[]
}

@Component({
  selector: 'app-delete-sponsored-user-dialog',
  templateUrl: './delete-sponsored-user-dialog.component.html',
  styleUrls: ['./delete-sponsored-user-dialog.component.scss']
})
export class DeleteSponsoredUserDialogComponent implements OnInit {

  theme: string;

  displayedColumns: string[] = ['id', 'name'];
  dataSource: MatTableDataSource<RichMember>;

  constructor(private dialogRef: MatDialogRef<DeleteSponsoredUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: DeleteSponsoredUserDialogData,
              private membersService: MembersManagerService,
              private notificator: NotificatorService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.theme = this.data.theme;

  }

  onConfirm() {
    for (const m of this.data.members) {
      this.membersService.deleteMember(m.id).subscribe(_ => {
        this.notificator.showSuccess(this.translate.instant('DIALOGS.DELETE_SPONSORED_USER.CANCEL'));
      });
    }
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
