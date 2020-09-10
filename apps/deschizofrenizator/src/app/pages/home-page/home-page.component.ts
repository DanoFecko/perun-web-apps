import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  Group, InputUpdateUser,
  RichUser, RichUserExtSource, User, UserExtSource,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MembersService, NotificatorService } from '@perun-web-apps/perun/services';

export interface MemberChange {
  vo: number;
  groups: Group[]
}

@Component({
  selector: 'perun-web-apps-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  static membersStack: MemberChange[];
  static attributesStack: Attribute[];
  static extSourcesStack: RichUserExtSource[];

  constructor(private usersService: UsersManagerService,
              private membersService: MembersService,
              private attributesManager: AttributesManagerService,
              private notificator: NotificatorService) {
    HomePageComponent.membersStack = [];
    HomePageComponent.attributesStack = [];
    HomePageComponent.extSourcesStack = [];
  }

  userToBeKept: RichUser;

  userToBeKeptID: number;

  userToBeRemoved: RichUser;

  userToBeRemovedID: number;

  @ViewChild('stepper', { static: false })
  stepper: MatHorizontalStepper;

  ngOnInit(): void {
  }

  changeUserToBeKept() {
    //65395
    this.usersService.getRichUserWithAttributes(this.userToBeKeptID).subscribe(user => {
      // user.userAttributes = user.userAttributes.filter(a => this.vapipe.transform(a) && a.writable);
      this.userToBeKept = user;
      this.usersService.getUserExtSources(this.userToBeKeptID).subscribe(extS => {
        this.userToBeKept.userExtSources = extS;
      });
    });
  }

  changeUserToBeRemoved() {
    this.usersService.getRichUserWithAttributes(this.userToBeRemovedID).subscribe(user => {
      this.userToBeRemoved = user;
      this.usersService.getUserExtSources(this.userToBeRemovedID).subscribe(extS => {
        this.userToBeRemoved.userExtSources = extS;
      });
    });
  }

  onSave() {
    const tmp = { ...this.userToBeKept };
    delete tmp.userExtSources;
    delete tmp.userAttributes;
    this.usersService.updateUser({ user: tmp }).subscribe(() => {
      if (HomePageComponent.attributesStack.length > 0) {
        this.attributesManager.setUserAttributes({
          user: this.userToBeKept.id,
          attributes: HomePageComponent.attributesStack
        }).subscribe(() => {
          this.saveMembers();
        });
      } else {
        this.saveMembers();
      }
    });
  }

  saveMembers() {
    if (HomePageComponent.membersStack.length > 0) {
      for (const m of HomePageComponent.membersStack) {
        if (m.groups.length > 0) {
          this.membersService.createMemberWithGroups(m.vo, this.userToBeKept.id, m.groups).subscribe(() => {
            this.saveExtSource();
          });
        } else {
          this.membersService.createMember(m.vo, this.userToBeKept.id).subscribe(() => {
            this.saveExtSource();
          });
        }
      }
    } else {
      this.saveExtSource();
    }
  }

  saveExtSource() {
    if (HomePageComponent.extSourcesStack.length > 0) {
      for (const e of HomePageComponent.extSourcesStack) {
        // const ues: UserExtSource = {
        //   beanName: '',
        //   extSource: e.userExtSource.extSource,
        //   id: 0,
        //   login: e.userExtSource.login,
        //   loa: e.userExtSource.loa,
        //   userId: this.userToBeKept.id
        // };
        // this.usersService.addUserExtSource({ user: this.userToBeKept.id, userExtSource: ues }).subscribe(() => {
        //   this.saveDeleteUser();
        // });
        this.usersService.moveUserExtSource(this.userToBeRemoved.id, this.userToBeKept.id, e.userExtSource.id).subscribe(() => {
          this.saveDeleteUser();
        });
      }
    } else {
      this.saveDeleteUser();
    }
  }
//TODO optional
  saveDeleteUser() {
    this.usersService.deleteUser(this.userToBeRemoved.id, true).subscribe(() => {
      this.notificator.showSuccess('Operation successful');
      console.log('success');
    });
  }

  onReset() {
    // this.stepper.selectedIndex = 0;
    if (this.userToBeKept !== undefined) {
      this.changeUserToBeKept();
    }
    if (this.userToBeRemoved !== undefined) {
      this.changeUserToBeRemoved();
    }
    HomePageComponent.attributesStack = [];
    HomePageComponent.extSourcesStack = [];
    HomePageComponent.membersStack = [];
  }
}
