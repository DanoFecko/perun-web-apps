import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { GroupService, RegistrarService } from '@perun-web-apps/perun/services';
import { Application, Group } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-group-applications',
  templateUrl: './group-applications.component.html',
  styleUrls: ['./group-applications.component.scss']
})
export class GroupApplicationsComponent implements OnInit {

  static id = 'GroupApplicationsComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(private groupService: GroupService,
              private registarService: RegistrarService,
              protected route: ActivatedRoute) { }

  state = 'pending';
  loading = false;
  applications: Application[] = [];
  group: Group;
  displayedColumns: string[] = ['id', 'createdAt', 'type', 'state', 'user', 'extSourceLoa', 'modifiedBy'];
  filterValue = '';

  ngOnInit() {
    this.loading = true;
    this.route.parent.params.subscribe(parentParams => {
      const groupId = parentParams['groupId'];
      this.groupService.getGroupById(groupId).subscribe( group => {
        this.group = group;
        this.setData(['NEW', 'VERIFIED']);
      });
    });
  }


  setData(state: string[]) {
    this.registarService.getApplicationsForGroupWithState(this.group.id, state).subscribe(applications => {
      this.applications = applications;
      this.loading = false;
    });
  }

  select() {
    this.loading = true;
    switch (this.state) {
      case 'approved': {
        this.setData(['APPROVED']);
        break;
      }
      case 'rejected': {
        this.setData(['REJECTED']);
        break;
      }
      case 'wfmv': {
        this.setData(['NEW']);
        break;
      }
      case 'submited': {
        this.setData(['VERIFIED']);
        break;
      }
      case 'pending': {
        this.setData(['NEW', 'VERIFIED']);
        break;
      }
      case 'all': {
        this.registarService.getApplicationsForGroup(this.group.id).subscribe(applications => {
          this.applications = applications;
          this.loading = false;
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
  }
}
