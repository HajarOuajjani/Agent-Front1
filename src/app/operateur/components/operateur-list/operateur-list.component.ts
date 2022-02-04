import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/patagee/components/confirmation-dialog/confirmation-dialog.component';
import { Operator } from '../../model/operator';
import { MatTableDataSource } from '@angular/material/table';
import { OperatorService } from '../../service/operator.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operateur-list.component.html',
  styleUrls: ['./operateur-list.component.css'],
})
export class OperateurListComponent implements OnInit {
  OPERATORS: Operator[];

  dataSource = new MatTableDataSource<Operator>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  displayedColumns: string[] = [
    'id',
    'username',
    'nom',
    'email',
    'adresse',
    'telephone',
    'actions',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private operatorService: OperatorService,
    public dialog: MatDialog
  ) {}

  deleteOperator(id: number) {
    this.operatorService.delete(id).subscribe(
      (data) => {
        console.log(data);

        this.operatorService.findAll().subscribe(
          (data) => {
            this.OPERATORS = data._embedded.operateurs;
            this.dataSource = new MatTableDataSource<Operator>(this.OPERATORS);
          },
          (error) => {
            this.dataSource = new MatTableDataSource<Operator>(null);
          }
        );
      },
      (error) => console.log(error)
    );
  }

  ngOnInit(): void {
    console.log('bonsoir');
    this.operatorService.findAll().subscribe(
      (data) => {
        console.log(data);
        this.OPERATORS = data._embedded.operateurs;
        this.dataSource = new MatTableDataSource<Operator>(this.OPERATORS);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log(error);
        this.dataSource = new MatTableDataSource<Operator>(null);
      }
    );
  }

  openDialog(code: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Voulez vous vraiment supprimer cet operateur ' + code + '?',
        codeSupp: code,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteOperator(result.data.codeSupp);
      }
    });
  }
}
