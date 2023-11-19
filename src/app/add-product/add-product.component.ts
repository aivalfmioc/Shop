import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  category: string[] = [
    'Plants',
    'Fresh foods',
    'Frozen foods',
    'Alcohol',
    'Pet shop'
  ]

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private dialogRef: MatDialogRef<AddProductComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.productForm = this.formBuilder.group({
      name: '',
      price: '',
      category: '',
      expiryDate: '',
      unitsInStock: '',
      presentDate: new FormControl((new Date()).toISOString().substring(0, 10)),
      modifiedDate: new FormControl((new Date()).toISOString().substring(0, 10))
    })
  }
  ngOnInit(): void {
    this.productForm.patchValue(this.data);
  }
  onFormSubmit() {
    if (this.productForm.valid) {
      if (this.data) {
        console.log(this.productForm.value);
        this.productService.updateProduct(this.data.id, this.productForm.value).subscribe({
          next: (val: any) => {
            alert('Product updated');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });

      }
      else {
        console.log(this.productForm.value);
        this.productService.addProduct(this.productForm.value).subscribe({
          next: (val: any) => {
            alert('Added succesfully');
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
    }
    else
      console.log("no");

  }



}
