import { Component, OnInit } from '@angular/core';
import {
  MembersManagerService,
  RichMember,
  RichUser,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private usersService: UsersManagerService,
              private membersService: MembersManagerService) {
  }

  userToBeKept: RichUser;

  userToBeKeptID: number;

  userToBeRemoved: RichUser;

  userToBeRemovedID: number;

  membersKept: RichMember[] = [];
  membersRemoved: RichMember[] = [];

  ngOnInit(): void {
  }

  changeUserToBeKept() {
    //65395
    this.usersService.getRichUserWithAttributes(this.userToBeKeptID).subscribe(user => {
      this.userToBeKept = user;
      this.usersService.getUserExtSources(this.userToBeKeptID).subscribe(extS => {
        this.userToBeKept.userExtSources = extS;
        this.membersService.getMembersByUser(this.userToBeKeptID).subscribe(members => {
          for (const m of members) {
            // const rm = m as RichMember;
            // rm.user = this.userToBeKept
            // rm.userExtSources = this.userToBeKept.userExtSources;
            // rm.userAttributes = this.userToBeKept.userAttributes;
            // rm.memberAttributes = this
            // this.membersKept.push(rm);
            this.membersService.getRichMemberWithAttributes(m.id).subscribe(richMember => this.membersKept.push(richMember));
          }
        });
      });
    });
  }

  changeUserToBeRemoved() {
    this.usersService.getRichUserWithAttributes(this.userToBeRemovedID).subscribe(user => {
      this.userToBeRemoved = user;
      this.usersService.getUserExtSources(this.userToBeRemovedID).subscribe(extS => {
        this.userToBeRemoved.userExtSources = extS;
        this.membersService.getMembersByUser(this.userToBeRemovedID).subscribe(members => {
          for (const m of members) {
            this.membersService.getRichMemberWithAttributes(m.id).subscribe(richMember => this.membersRemoved.push(richMember));
          }
        });
      });
    });
  }
}
