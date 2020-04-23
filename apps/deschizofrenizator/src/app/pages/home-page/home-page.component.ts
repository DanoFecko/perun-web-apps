import { Component, OnInit } from '@angular/core';
import { RichUser, UsersManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'perun-web-apps-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private usersService: UsersManagerService) {
  }

  userToBeKept: RichUser;

  userToBeKeptID: number;

  userToBeRemoved: RichUser;

  userToBeRemovedID: number;

  ngOnInit(): void {
  }

  changeUserToBeKept() {
    //65395
    //console.log(id);
    this.usersService.getRichUserWithAttributes(this.userToBeKeptID).subscribe(user => {
      this.userToBeKept = user;
      this.usersService.getUserExtSources(this.userToBeKept.id).subscribe(extS => {
        this.userToBeKept.userExtSources = extS;
      });
    });
  }

  changeUserToBeRemoved() {
    console.log(this.userToBeRemovedID);
    this.usersService.getRichUserWithAttributes(this.userToBeRemovedID).subscribe(user => {
      this.userToBeRemoved = user;
      this.usersService.getUserExtSources(this.userToBeRemoved.id).subscribe(extS => {
        this.userToBeRemoved.userExtSources = extS;
      });
    });
  }
}
