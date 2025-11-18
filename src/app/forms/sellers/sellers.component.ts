import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { Seller } from 'src/app/models/seller.model';

@Component({
  standalone: true,
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule, FooterComponent]
})
export class SellersComponent implements OnInit {
  sellerForm: FormGroup;
  isEdit = false;

  constructor(private location: Location, private fb: FormBuilder) {
    this.sellerForm = this.fb.group({
      sellerId: ['', Validators.required],
      sellerName: ['', Validators.required],
      address: [''],
      phone: ['', [Validators.pattern(/^[0-9\-\+ ]{7,}$/)]],
      email: ['', [Validators.email]],
      gstin: ['']
    });
  }

  ngOnInit() {}

  get f() {
    return this.sellerForm.controls;
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }
    const seller = this.sellerForm.value;
    console.log(this.isEdit ? 'Updating seller' : 'Adding seller', seller);
  }

  setSellerForEdit(seller: Seller) {
    this.isEdit = true;
    this.sellerForm.patchValue(seller);
  }
}
