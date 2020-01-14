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
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { AttributeDefinition } from '@perun-web-apps/perun/models';
import { EditAttributeDefinitionDialogComponent } from '../../../shared/components/dialogs/edit-attribute-definition-dialog/edit-attribute-definition-dialog.component';

@Component({
  selector: 'app-attr-def-list',
  templateUrl: './attr-def-list.component.html',
  styleUrls: ['./attr-def-list.component.scss']
})
export class AttrDefListComponent implements OnChanges, AfterViewInit {

  constructor(private dialog: MatDialog) { }

  @Input()
  definitions: AttributeDefinition[];
  @Input()
  selection = new SelectionModel<AttributeDefinition>(true, []);
  @Input()
  hideColumns: string[] = [];
  @Input()
  filterValue: string;

  @Output()
  refreshEvent = new EventEmitter<void>();

  exporting = false;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['select', 'id', 'friendlyName', 'entity', 'namespace', 'type', 'unique'];
  dataSource: MatTableDataSource<AttributeDefinition>;

  private sort: MatSort;

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<AttributeDefinition>(this.definitions);
    this.setDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.filter = this.filterValue;

      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'namespace') {
          return item.namespace.substring(item.namespace.lastIndexOf(':') + 1, item.namespace.length);
        } else if (property === 'friendlyName') {
          return item[property].toLowerCase();
        }
        else {
          return item[property];
        }
      };

      this.dataSource.paginator = this.paginator;
    }
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

  checkboxLabel(row?: AttributeDefinition): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onRowClick(attDef: AttributeDefinition) {
    const dialogRef = this.dialog.open(EditAttributeDefinitionDialogComponent, {
      width: '700px',
      data: {
        attDef: attDef
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.refreshEvent.emit();
      }
    });
  }
}
