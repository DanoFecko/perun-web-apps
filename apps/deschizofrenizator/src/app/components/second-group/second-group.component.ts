import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Attribute, RichUser } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'perun-web-apps-second-group',
  templateUrl: './second-group.component.html',
  styleUrls: ['./second-group.component.css']
})
export class SecondGroupComponent implements OnChanges {

  constructor() {
  }

  @Input()
  userToBeKept: RichUser;

  @Input()
  userToBeRemoved: RichUser;

  selection = new SelectionModel<Attribute>(true, []);

  hiddenColumns = ['id', 'description'];

  ngOnChanges(changes: SimpleChanges): void {
  }

  onTransfer() {
    for (const a of this.selection.selected) {
      const tmp = this.userToBeKept.userAttributes.find(obj => obj.id === a.id);
      if (tmp !== undefined) {
        tmp.value = a.value;
      } else {
        this.userToBeKept.userAttributes.push(a);
      }
    }
    this.selection.clear();
  }

}
