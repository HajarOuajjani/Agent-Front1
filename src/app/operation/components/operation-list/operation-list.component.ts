import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from '../../model/operation';
import { OperationService } from '../../service/operation.service';
import { ConfirmationDialogComponent } from 'src/app/patagee/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.css'],
})
export class OperationListComponent implements OnInit {
  OPERATIONS: Operation[];
  codeId: string;
  codeId2: string;

  dataSource = new MatTableDataSource<Operation>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  displayedColumns: string[] = [
    'id',
    'sommeEspece',
    'sommeCompte',
    'type',
    'actions',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private operationService: OperationService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {
    console.log('operationList');
    this.codeId = this.route.snapshot.params.id;
    this.codeId2 = this.route.snapshot.params.id2;
    console.log(this.codeId, this.codeId2);
  }

  ngOnInit(): void {
    this.operationService.findOperations(this.codeId2).subscribe(
      (data) => {
        console.log(data);
        this.OPERATIONS = data;
        this.dataSource = new MatTableDataSource<Operation>(this.OPERATIONS);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log(error);
        this.dataSource = new MatTableDataSource<Operation>(null);
      }
    );
  }
  goToAccounts() {
    this.router.navigate(['/client/' + this.codeId + '/accounts']);
  }
}
