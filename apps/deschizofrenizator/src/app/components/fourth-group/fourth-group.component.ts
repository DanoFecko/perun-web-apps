import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  RichUser,
  UserExtSource,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { RichUserExtSource } from '@perun-web-apps/perun/models';

@Component({
  selector: 'perun-web-apps-fourth-group',
  templateUrl: './fourth-group.component.html',
  styleUrls: ['./fourth-group.component.scss']
})
export class FourthGroupComponent implements OnChanges {

  constructor(private usersManagerService: UsersManagerService) {
  }

  @Input()
  userToBeKept: RichUser;

  utkRichUserExtSources: RichUserExtSource[] = [];

  @Input()
  userToBeRemoved: RichUser;

  utrRichUserExtSources: RichUserExtSource[] = [];

  selection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>(true, []);
  hiddenColumns = ['select', 'mail', 'loa', 'lastAccess'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToBeKept']) {
      if (this.userToBeKept) {
        for (const es of this.userToBeKept.userExtSources) {
          const rues: RichUserExtSource = { userExtSource: es, attributes: [] };
          this.utkRichUserExtSources.push(rues);
        }
      }
    }
    if (changes['userToBeRemoved']) {
      if (this.userToBeRemoved) {
        for (const es of this.userToBeRemoved.userExtSources) {
          const rues: RichUserExtSource = { userExtSource: es, attributes: [] };
          this.utrRichUserExtSources.push(rues);
        }
      }
    }
  }

}
