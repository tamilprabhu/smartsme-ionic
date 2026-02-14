import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Stock } from 'src/app/models/stock.model';
import { Seller } from 'src/app/models/seller.model';
import { SellerService } from 'src/app/services/seller.service';
import { DateFieldComponent } from 'src/app/components/date-field/date-field.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, DateFieldComponent, FooterComponent]
})
export class StockComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Stock | null = null;
  @Output() formSubmit = new EventEmitter<Stock>();
  @Output() formClosed = new EventEmitter<void>();

  stockForm: FormGroup;
  sellers: Seller[] = [];
  rawMaterials = ['Steel', 'Aluminum', 'Plastic', 'Copper'];

  constructor(private fb: FormBuilder, private sellerService: SellerService) {
    const todayLocal = new Date().toISOString().split('T')[0];
    this.stockForm = this.fb.group({
      sellerId: ['', Validators.required],
      stockDate: [todayLocal, Validators.required],
      rawMaterial: ['', Validators.required],
      noOfBars: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      weight: [0, [Validators.required, Validators.min(0)]],
      inwardType: ['', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadSellers();
    if (this.formData) {
      this.patchForm(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.patchForm(this.formData);
      if (this.mode === 'read') {
        this.stockForm.disable();
      } else {
        this.stockForm.enable();
      }
    } else if (this.mode === 'create') {
      this.resetForm();
      this.stockForm.enable();
    }
  }

  get f() {
    return this.stockForm.controls;
  }

  loadSellers() {
    this.sellerService.getSellers(1, 1000).subscribe({
      next: (response) => {
        this.sellers = response.items;
      },
      error: (error) => {
        console.error('Error loading sellers:', error);
      }
    });
  }

  patchForm(data: Stock) {
    this.stockForm.patchValue({
      sellerId: data.sellerId,
      stockDate: data.stockDate ? data.stockDate.split('T')[0] : '',
      rawMaterial: data.rawMaterial,
      noOfBars: data.noOfBars,
      weight: data.weight,
      inwardType: data.inwardType,
      rate: data.rate
    });
  }

  resetForm() {
    this.stockForm.reset({
      stockDate: new Date().toISOString().split('T')[0],
      noOfBars: 0,
      weight: 0,
      rate: 0
    });
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') return;
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    const formValue = this.stockForm.getRawValue();
    const apiData: Stock = {
      stockIdSeq: this.formData?.stockIdSeq || 0,
      stockId: this.formData?.stockId || '',
      companyId: this.formData?.companyId || 'FINO001',
      sellerId: formValue.sellerId,
      stockDate: formValue.stockDate,
      rawMaterial: formValue.rawMaterial,
      noOfBars: Number(formValue.noOfBars),
      weight: Number(formValue.weight),
      inwardType: formValue.inwardType,
      rate: Number(formValue.rate),
      createDate: this.formData?.createDate || new Date().toISOString(),
      updateDate: new Date().toISOString()
    };

    this.formSubmit.emit(apiData);
  }
}
