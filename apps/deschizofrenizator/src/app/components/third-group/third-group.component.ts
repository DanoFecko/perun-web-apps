import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MembersManagerService, RichMember, RichUser } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'perun-web-apps-third-group',
  templateUrl: './third-group.component.html',
  styleUrls: ['./third-group.component.scss']
})
export class ThirdGroupComponent implements OnChanges {

  constructor(private membersService: MembersManagerService) {
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
      this.membersService.getMembersByUser(this.userToBeRemoved.id).subscribe(members => {
        this.membersRLength = members.length;
        for (const m of members) {
          this.membersService.getRichMemberWithAttributes(m.id).subscribe(richMember => {
            this.membersRemoved.push(richMember);
          });
        }
      });
    }

    if (changes['userToBeKept']) {
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

  onTransfer() {
    for (const m of this.selection.selected) {
      const tmp = this.membersKept.findIndex(obj => obj.id === m.id);
      if (tmp !== undefined) {
        this.membersKept[tmp] = m;
      } else {
        this.membersKept.push(m);
      }
    }
    this.selection.clear();
  }

}
