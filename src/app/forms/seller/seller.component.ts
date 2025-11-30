import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { Seller } from 'src/app/models/seller.model';

@Component({
  selector: 'app-sellers',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class SellerComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Seller | null = null;

  @Output() formSubmit = new EventEmitter<Seller>();
  @Output() formClosed = new EventEmitter<void>();

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

  ngOnInit() {
    if (this.formData) {
      this.patchForm(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.isEdit = this.mode === 'update';
      this.patchForm(this.formData);

      if (this.mode === 'read') {
        this.sellerForm.disable();
      } else {
        this.sellerForm.enable();
      }
    } else if (this.mode === 'create') {
      this.resetForm();
      this.sellerForm.enable();
    }
  }

  get f() {
    return this.sellerForm.controls;
  }

  patchForm(data: Seller) {
    this.sellerForm.patchValue(data);
  }

  resetForm() {
    this.sellerForm.reset();
    this.isEdit = false;
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') {
      return; // prevent submit in read mode
    }

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.sellerForm.value);
  }
}
