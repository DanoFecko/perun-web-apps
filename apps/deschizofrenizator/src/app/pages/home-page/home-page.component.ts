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

  ngOnInit(): void {
  }

  changeUserToBeKept() {
    //65395
    this.usersService.getRichUserWithAttributes(this.userToBeKeptID).subscribe(user => {
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
  }

  onReset() {
    if (this.userToBeKept !== undefined) { this.changeUserToBeKept() }
    if (this.userToBeRemoved !== undefined) { this.changeUserToBeRemoved() }
  }
}
