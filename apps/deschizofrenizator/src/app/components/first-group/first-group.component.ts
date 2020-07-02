import { Component, Input, OnInit } from '@angular/core';
import { RichUser, UsersManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-first-group',
  templateUrl: './first-group.component.html',
  styleUrls: ['./first-group.component.css']
})
export class FirstGroupComponent implements OnInit {

  constructor() {
  }

  @Input()
  userToBeKept: RichUser;

  @Input()
  userToBeRemoved: RichUser;

  ngOnInit(): void {
  }

  firstNameTransfer() {
    this.userToBeKept.firstName = this.userToBeRemoved.firstName;
  }

  lastNameTransfer() {
    this.userToBeKept.lastName = this.userToBeRemoved.lastName;
  }

  middleNameTransfer() {
    this.userToBeKept.middleName = this.userToBeRemoved.middleName;
  }

  titleBeforeTransfer() {
    this.userToBeKept.titleBefore = this.userToBeRemoved.titleBefore
  }

  titleAfterTransfer() {
    this.userToBeKept.titleAfter = this.userToBeRemoved.titleAfter;
  }

  sponsoredTransfer() {
    this.userToBeKept.sponsoredUser = this.userToBeRemoved.sponsoredUser;
  }
}
