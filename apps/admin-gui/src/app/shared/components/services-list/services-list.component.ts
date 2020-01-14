import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { Service } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnChanges, OnInit {

  constructor() {
  }

  @ViewChild(MatSort, {static: true}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @Input()
  services: Service[] = [];

  private sort: MatSort;

  @Input()
  hideColumns: string[] = [];

  displayedColumns: string[] = ['select', 'id', 'name', 'enabled', 'script', 'description'];
  dataSource: MatTableDataSource<Service>;

  @Input()
  selection;

  ngOnInit() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    this.dataSource = new MatTableDataSource<Service>(this.services);
    this.setDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    this.dataSource = new MatTableDataSource<Service>(this.services);
    this.setDataSource();
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Service): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
