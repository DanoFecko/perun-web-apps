import { Component, Input, OnInit } from '@angular/core';
import { RichUser } from '@perun-web-apps/perun/openapi';

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

}
