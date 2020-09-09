import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import { RichMember } from '@perun-web-apps/perun/openapi';
import {
  getDefaultDialogConfig,
  parseEmail,
  parseFullName,
  TABLE_ITEMS_COUNT_OPTIONS
} from '@perun-web-apps/perun/utils';
import { ChangeMemberStatusDialogComponent } from '../../../../../../apps/admin-gui/src/app/shared/components/dialogs/change-member-status-dialog/change-member-status-dialog.component';

@Component({
  selector: 'perun-web-apps-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnChanges, AfterViewInit {

  constructor(private dialog: MatDialog) { }

  private sort: MatSort;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  members: RichMember[];

  @Input()
  searchString: string;

  @Input()
  selection: SelectionModel<RichMember> = new SelectionModel<RichMember>();

  @Input()
  hideColumns: string[] = [];

  @Input()
  pageSize = 10;

  @Output()
  page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @Output()
  updateTable = new EventEmitter<boolean>();

  exporting = false;

  displayedColumns: string[] = ['checkbox', 'id', 'fullName', 'status', 'groupStatus', 'email'];
  dataSource: MatTableDataSource<RichMember>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  setDataSource() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;

      this.dataSource.sortingDataAccessor = (richMember, property) => {
        switch (property) {
          case 'fullName':
            return parseFullName(richMember.user);
          case 'email':
            return parseEmail(richMember);
          default:
            return richMember[property];
        }
      };

      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    this.dataSource = new MatTableDataSource<RichMember>(this.members);
    this.setDataSource();
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

  checkboxLabel(row?: RichMember): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  changeStatus(event: any, member: RichMember) {
    event.stopPropagation();
    if (member.status === 'INVALID') {
      const config = getDefaultDialogConfig();
      config.width = '500px';
      config.data = {member: member};

      const dialogRef = this.dialog.open(ChangeMemberStatusDialogComponent, config);
      dialogRef.afterClosed().subscribe( success => {
        if (success) {
          this.updateTable.emit(true);
        }
      })
    }
  }

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }
}
