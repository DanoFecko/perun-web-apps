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
import { RichUserExtSource, UserExtSource } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'perun-web-apps-user-ext-sources-list',
  templateUrl: './user-ext-sources-list.component.html',
  styleUrls: ['./user-ext-sources-list.component.scss']
})
export class UserExtSourcesListComponent implements AfterViewInit, OnChanges {

  constructor(private route: ActivatedRoute) {
  }

  @Input()
  userExtSources: RichUserExtSource[];
  @Input()
  selection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>();
  @Input()
  filterValue = '';
  @Input()
  hideColumns: string[] = [];
  @Input()
  pageSize = 5;
  @Input()
  extSourceNameHeader: string;
  @Input()
  loginHeader: string;
  @Input()
  disableRouting: boolean;
  @Input()
  enableTransfer = false;

  @Output()
  transfer = new EventEmitter<UserExtSource>();

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  private sort: MatSort;

  displayedColumns: string[] = ['select', 'id', 'mail', 'extSourceName', 'login', 'loa', 'lastAccess'];
  displayedColumnsWithTransfer: string[] = ['select', 'id', 'mail', 'extSourceName', 'login', 'loa', 'lastAccess', 'transfer'];
  dataSource: MatTableDataSource<RichUserExtSource>;
  exporting = false;
  userId: number;

  ngAfterViewInit() {
    if (!this.disableRouting) {
      this.route.parent.params.subscribe(params => {
        this.userId = params['userId'];
      });
    }
    this.setDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.enableTransfer) {
      this.displayedColumns = this.displayedColumnsWithTransfer.filter(x => !this.hideColumns.includes(x));
    } else {
      this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    }
    this.dataSource = new MatTableDataSource<RichUserExtSource>(this.userExtSources);
    this.setDataSource();
  }

  setDataSource() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  checkboxLabel(row?: RichUserExtSource): string {
    return `${this.selection.isSelected(row.userExtSource) ? 'deselect' : 'select'} row ${row.userExtSource.id + 1}`;
  }
}
