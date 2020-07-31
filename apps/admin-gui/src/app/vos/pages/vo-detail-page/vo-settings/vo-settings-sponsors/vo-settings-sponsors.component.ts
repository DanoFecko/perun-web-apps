import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-vo-settings-sponsors',
  templateUrl: './vo-settings-sponsors.component.html',
  styleUrls: ['./vo-settings-sponsors.component.scss']
})
export class VoSettingsSponsorsComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private dialog: MatDialog,
    private voService: VosManagerService,
    private route: ActivatedRoute
  ) { }

  vo: Vo;

  availableRoles: Role[] = [ Role.SPONSOR ];

  selected = 'user';

  type = 'Vo';

  theme = 'vo-theme';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParentParams => {
      const voId = parentParentParams ['voId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
      });
    });
  }

}
