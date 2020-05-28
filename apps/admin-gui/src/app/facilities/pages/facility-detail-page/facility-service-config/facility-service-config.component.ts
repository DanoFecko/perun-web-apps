import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FacilitiesManagerService,
  Facility,
  Group,
  Resource,
  ResourcesManagerService, RichMember, Service, ServicesManagerService, Vo
} from '@perun-web-apps/perun/openapi';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ServiceSelectValue } from '@perun-web-apps/perun/facility-services-config';
import { MembersService } from '@perun-web-apps/perun/services';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';


@Component({
  selector: 'app-facility-service-config',
  templateUrl: './facility-service-config.component.html',
  styleUrls: ['./facility-service-config.component.scss']
})
export class FacilityServiceConfigComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private facilityManager: FacilitiesManagerService,
    private resourceManager: ResourcesManagerService,
    private serviceManager: ServicesManagerService,
    private membersManager: MembersService,
    private namePipe: UserFullNamePipe
  ) {
  }

  facility: Facility;
  serviceId: number;

  services: Service[];
  resources: Resource[];
  groups: Group[];
  vos: Vo[];
  members: RichMember[];

  selectedService: Service | ServiceSelectValue = 'NOT_SELECTED';
  selectedResource: Resource;
  selectedGroup: Group;
  selectedVo: Vo;
  selectedMember: RichMember;

  private attrNames = [];

  serviceField = new FormControl();
  resourceField = new FormControl();
  groupField = new FormControl();
  memberField = new FormControl();

  filteredServices: Observable<Service[]>;
  filteredResources: Observable<Resource[]>;
  filteredGroups: Observable<Group[]>;
  filteredMembers: Observable<RichMember[]>;

  ngOnInit() {
    this.route.parent.params.subscribe(parentParams => {
      const facilityId = parentParams['facilityId'];

      this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
        this.facility = facility;

        this.facilityManager.getAssignedResourcesForFacility(facility.id)
          .subscribe(resources => this.resources = resources);

        this.serviceManager.getAssignedServices(facility.id).subscribe(services => this.services = services);
      });
    });
    this.filteredServices = this.serviceField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterServices(value))
      );
    this.filteredResources = this.resourceField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterResources(value))
      );
    this.filteredGroups = this.groupField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroups(value))
      );
    this.filteredMembers = this.memberField.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterMembers(value))
      );
  }

  onSelectedService(s: Service) {
    this.selectedService = s;
  }

  onSelectedResource(r: Resource) {
    this.selectedResource = r;
    if (this.selectedResource !== undefined) {
      this.resourceManager.getAssignedGroups(this.selectedResource.id).subscribe(groups => this.groups = groups);
      this.selectedGroup = undefined;
      this.selectedMember = undefined;
    }
  }

  onOfferAllServices(event: MatCheckboxChange) {
    if (!event.checked) {
      this.serviceManager.getAssignedServices(this.facility.id).subscribe(services => this.services = services);
    }
  }

  onSelectedGroup(g: Group) {
    this.selectedGroup = g;
    if (this.selectedGroup !== undefined) {
      this.membersManager.getCompleteRichMembersForGroup(this.selectedGroup.id, this.attrNames).subscribe(members => this.members = members);
      this.selectedMember = undefined;
    }
  }

  onSelectedMember(m: RichMember) {
    this.selectedMember = m;
  }

  private _filterServices(value: String): Service[] {
    const filterValue = value.toString().toLowerCase();

    return this.services.filter(service => service.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
  }

  private _filterResources(value: String): Resource[] {
    const filterValue = value.toString().toLowerCase();

    return this.resources.filter(resource => resource.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
  }

  private _filterGroups(value: String): Group[] {
    const filterValue = value.toString().toLowerCase();

    return this.groups.filter(group => group.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
  }

  private _filterMembers(value: String): RichMember[] {
    const filterValue = value.toString().toLowerCase();
    return this.members.filter(member => this.namePipe.transform(member.user).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(filterValue));
  }

  serviceDisplayFn(service) {
    if (service !== null) {
      return service.name;
    }
  }

  resourceDisplayFn(resource) {
    if (resource !== null) {
      return resource.name;
    }
  }

  groupDisplayFn(group) {
    if (group !== null) {
      return group.name;
    }
  }

  memberDisplayFn(member) {
    if (member !== null) {
      return this.namePipe.transform(member.user);
    }
  }
}
