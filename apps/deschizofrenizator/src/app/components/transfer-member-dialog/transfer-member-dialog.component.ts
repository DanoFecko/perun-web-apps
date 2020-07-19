import { Component, EventEmitter, Inject, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

export interface TransferMemberDialogData {
  memberId: number;
}

@Component({
  selector: 'perun-web-apps-transfer-member-dialog',
  templateUrl: './transfer-member-dialog.component.html',
  styleUrls: ['./transfer-member-dialog.component.scss']
})
export class TransferMemberDialogComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  private sort: MatSort;

  groups: Group[] = [];

  @Output()
  page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  displayedColumns: string[] = ['checkbox', 'id', 'name'];
  dataSource: MatTableDataSource<Group> = new MatTableDataSource<Group>();
  selection: SelectionModel<Group> = new SelectionModel<Group>();

  constructor(private dialogRef: MatDialogRef<TransferMemberDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: TransferMemberDialogData,
              private groupsService: GroupsManagerService) {
  }

  ngOnInit(): void {
    this.groupsService.getMemberGroups(this.data.memberId).subscribe(groups => {
      if (groups.length === 0) {
        this.dialogRef.close('0');
      }
      this.groups = groups;
      this.dataSource = new MatTableDataSource<Group>(this.groups);
      this.setDataSource();
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Group): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }

  transfer() {
    this.dialogRef.close('1+');
  }

  close() {
    this.dialogRef.close('cancel');
  }
}
