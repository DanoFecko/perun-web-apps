import { Component, Input, OnInit } from '@angular/core';
import { RichMember, RichUser } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'perun-web-apps-third-group',
  templateUrl: './third-group.component.html',
  styleUrls: ['./third-group.component.scss']
})
export class ThirdGroupComponent implements OnInit {

  constructor() { }

  @Input()
  userToBeKept: RichUser;

  @Input()
  userToBeRemoved: RichUser;

  @Input()
  membersKept: RichMember[]

  @Input()
  membersRemoved: RichMember[]

  selection = new SelectionModel<RichMember>(true, []);

  hiddenColumns = ['id', 'type'];

  ngOnInit(): void {
  }

}
