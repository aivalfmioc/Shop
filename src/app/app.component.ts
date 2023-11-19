import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductService } from './services/product.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'price',
    'category',
    'expiryDate',
    'unitsInStock',
    'presentDate',
    'modifiedDate',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;
  showExpiredProducts = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private productService: ProductService) {

  }
  ngOnInit(): void {
    this.getProductList();

  }
  openAddEditProductForm() {
    const dialogRef = this.dialog.open(AddProductComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      }
    })
  }

  getProductList() {
    this.productService.getProductList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilterByExpiryDate(event: Event) {

    const currentDate = new Date();


    if (this.showExpiredProducts) {
      this.getProductList();
      this.showExpiredProducts = false;
    }
    else {
      this.dataSource.data = this.dataSource.data.filter((data) => {
        const expiryDate = new Date(data.expiryDate);
        return expiryDate < currentDate;
      });
      this.showExpiredProducts = true;
    }
  }

  deleteEmployee(id: number) {
    this.productService.deleteEmployee(id).subscribe({
      next: (res) => {
        alert('Employee deleted')
        this.getProductList()
      },
      error: console.log,
    })
  }
  openEditForm(data: any) {
    const dialogRef = this.dialog.open(AddProductComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      }
    })
  }

}
