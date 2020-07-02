import { Component, Input, OnInit } from '@angular/core';
import { Attribute, RichUser } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'perun-web-apps-second-group',
  templateUrl: './second-group.component.html',
  styleUrls: ['./second-group.component.css']
})
export class SecondGroupComponent implements OnInit {

  constructor() { }

  @Input()
  userToBeKept: RichUser;

  @Input()
  userToBeRemoved: RichUser;

  selection = new SelectionModel<Attribute>(true, []);

  hiddenColumns = ['id', 'description'];

  ngOnInit(): void {
  }

}
