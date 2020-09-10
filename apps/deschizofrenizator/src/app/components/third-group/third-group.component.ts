import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MembersManagerService, RichMember, RichUser } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MembersService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { TransferMemberDialogComponent } from '../transfer-member-dialog/transfer-member-dialog.component';

@Component({
  selector: 'perun-web-apps-third-group',
  templateUrl: './third-group.component.html',
  styleUrls: ['./third-group.component.scss']
})
export class ThirdGroupComponent implements OnChanges {

  constructor(private membersService: MembersManagerService,
              private membersService2: MembersService,
              private dialog: MatDialog) {
  }

  @Input()
  userToBeKept: RichUser;

  @Input()
  userToBeRemoved: RichUser;

  @Input()
  membersKept: RichMember[] = [];

  @Input()
  membersRemoved: RichMember[] = [];

  selection = new SelectionModel<RichMember>(true, []);

  hiddenColumns = ['id', 'type'];

  membersKLength: number;
  membersRLength: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToBeRemoved']) {
      if (this.userToBeRemoved) {
        this.membersService.getMembersByUser(this.userToBeRemoved.id).subscribe(members => {
          this.membersRLength = members.length;
          for (const m of members) {
            this.membersService.getRichMemberWithAttributes(m.id).subscribe(richMember => {
              this.membersRemoved.push(richMember);
            });
          }
        });
      }
    }

    if (changes['userToBeKept']) {
      if (this.userToBeKept) {
        this.membersService.getMembersByUser(this.userToBeKept.id).subscribe(members => {
          this.membersKLength = members.length;
          for (const m of members) {
            this.membersService.getRichMemberWithAttributes(m.id).subscribe(richMember => {
              this.membersKept.push(richMember);
            });
          }
        });
      }
    }
  }

  // onTransfer() {
  //   for (const m of this.selection.selected) {
  //     const tmp = this.membersKept.findIndex(obj => obj.id === m.id);
  //     if (tmp !== undefined) {
  //       this.membersKept[tmp] = m;
  //     } else {
  //       this.membersKept.push(m);
  //     }
  //   }
  //   this.selection.clear();
  // }

  onTransfer(member: RichMember) {
    const dialogRef = this.dialog.open(TransferMemberDialogComponent, {
      data: {
        utk: this.userToBeKept,
        memberId: member.id,
        voId: member.voId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === '1+') {
        this.membersKept.push(member);
        this.membersKLength = this.membersKLength + 1;
      }
    });
  }

}
