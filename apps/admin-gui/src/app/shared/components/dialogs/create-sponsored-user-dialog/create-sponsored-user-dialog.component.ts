import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Attribute,
  AuthzResolverService,
  Candidate,
  MembersManagerService,
  UsersManagerService
} from '@perun-web-apps/perun/openapi';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface CreateSponsoredUserDialogData {
  entityId?: number
  voId?: number;
  theme: string,
}

@Component({
  selector: 'app-create-sponsored-user-dialog',
  templateUrl: './create-sponsored-user-dialog.component.html',
  styleUrls: ['./create-sponsored-user-dialog.component.scss']
})
export class CreateSponsoredUserDialogComponent implements OnInit {

  formGroup: FormGroup ;

  theme: string;

  firstName: string;
  lastName: string;
  titleBefore: string;
  titleAfter: string;
  password: string;
  namespace: string;
  login: string;
  email: string;

  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  // firstName = new FormControl('', [Validators.required]);
  //
  // lastName = new FormControl('', [Validators.required]);
  //
  // titleBefore = new FormControl('', []);
  //
  // titleAfter = new FormControl('', []);
  //
  // password = new FormControl('', [Validators.required]);
  //
  // namespace = new FormControl('', [Validators.required,]);
  //
  // login = new FormControl('', [Validators.required]);
  //
  // email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private dialogRef: MatDialogRef<CreateSponsoredUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: CreateSponsoredUserDialogData,
              private membersService: MembersManagerService,
              private store: StoreService,
              private notificator: NotificatorService,
              private translate: TranslateService,
              private usersService: UsersManagerService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.formGroup = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      titleBefore: [null],
      titleAfter: [null],
      namespace: [null, Validators.required],
      login: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required]
    });
  }

  onConfirm() {
    const candidate = {} as Candidate;
    candidate.firstName = this.firstName;
    candidate.lastName = this.lastName;
    candidate.titleAfter = this.titleAfter;
    candidate.titleBefore = this.titleBefore;
    candidate.sponsoredUser = true;

    candidate.attributes = {
      ['urn:perun:user:attribute-def:def:login-namespace:' + this.namespace]: this.login,
      ['urn:perun:member:attribute-def:def:mail']: this.email
    };

    this.membersService.createSpecificMember(candidate, this.data.voId, 'SPONSORED', [this.store.getPerunPrincipal().user]).subscribe(rm => {

      this.usersService.reservePassword(this.login, this.namespace, this.password).subscribe(_ => this.notificator.showSuccess(this.translate.instant('DIALOGS.CREATE_SPONSORED_USER.SUCCESS')));
    });
  }

  onCancel() {
    this.dialogRef.close();
  }


}
