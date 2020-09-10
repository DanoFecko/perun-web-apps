import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import {
  RichUser,
  UserExtSource,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { RichUserExtSource } from '@perun-web-apps/perun/models';
import { UserExtSourcesListComponent } from '@perun-web-apps/perun/components';
import { HomePageComponent } from '../../pages/home-page/home-page.component';

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
  hiddenColumnsR = ['mail', 'loa', 'lastAccess'];
  hiddenColumnsK = ['select', 'mail', 'loa', 'lastAccess'];

  @ViewChild('table', {static: false})
  table: UserExtSourcesListComponent

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToBeKept']) {
      this.utkRichUserExtSources = [];
      if (this.userToBeKept) {
        for (const es of this.userToBeKept.userExtSources) {
          const rues: RichUserExtSource = { userExtSource: es, attributes: [] };
          this.utkRichUserExtSources.push(rues);
        }
      }
    }
    if (changes['userToBeRemoved']) {
      if (this.userToBeRemoved) {
        this.utrRichUserExtSources = [];
        for (const es of this.userToBeRemoved.userExtSources) {
          const rues: RichUserExtSource = { userExtSource: es, attributes: [] };
          this.utrRichUserExtSources.push(rues);
        }
      }
    }
  }

  onTransfer() {
    let ues: any
    for (ues of this.selection.selected) {
      console.log(ues);
      // for (const tmp of this.utrRichUserExtSources) {
      //   if (tmp.userExtSource.id === ues.id) {
      //     ues.extSource = tmp.userExtSource.extSource;
      //     console.log(ues.extSource);
      //   }
      // }
      HomePageComponent.extSourcesStack.push(ues);
      //ues.userId = this.userToBeKept.id;
      //const rues: RichUserExtSource = { userExtSource: ues, attributes: [] };
      //this.userToBeKept.userExtSources.push(ues);
      this.utkRichUserExtSources.push(ues);
      //console.log(this.utkRichUserExtSources);
    }
  }
}
