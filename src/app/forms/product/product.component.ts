import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class ProductComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Product | null = null;
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() formClosed = new EventEmitter<void>();

  productForm: FormGroup;

  rawMaterials = ['Steel', 'Aluminum', 'Plastic', 'Copper']; // example options

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      rawMaterial: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      wastage: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      norms: [0, [Validators.required, Validators.min(0)]],
      totalWeight: [{ value: 0, disabled: true }],
      cavity: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      shotRate: [0, [Validators.required, Validators.min(0)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      incentiveLimit: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      productionShotQty: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      perHourProdQty: [0, [Validators.required, Validators.min(0)]]
    });

    // Watch weight and wastage to calculate totalWeight real-time
    this.productForm.get('weight')?.valueChanges.subscribe(() => this.updateTotalWeight());
    this.productForm.get('wastage')?.valueChanges.subscribe(() => this.updateTotalWeight());
  }

  ngOnInit() {
    if (this.formData) {
      this.patchForm(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.patchForm(this.formData);
      if (this.mode === 'read') {
        this.productForm.disable();
      } else {
        this.productForm.enable();
      }
      this.updateTotalWeight();
    } else if (this.mode === 'create') {
      this.resetForm();
      this.productForm.enable();
    }
  }

  get f() {
    return this.productForm.controls;
  }

  patchForm(data: Product) {
    this.productForm.patchValue({
      productId: data.prodId,
      productName: data.prodName,
      rawMaterial: data.rawMaterial,
      weight: data.weight,
      wastage: data.wastage,
      norms: data.norms,
      totalWeight: data.totalWeight,
      cavity: data.cavity,
      shotRate: data.shotRate,
      rate: data.perItemRate,
      incentiveLimit: data.incentiveLimit,
      productionShotQty: 0, // Default value
      perHourProdQty: 0 // Default value
    });
  }

  resetForm() {
    this.productForm.reset();
  }

  goBack() {
    this.formClosed.emit();
  }

  updateTotalWeight() {
    const weight = this.productForm.get('weight')?.value || 0;
    const wastage = this.productForm.get('wastage')?.value || 0;
    const totalWeight = weight * (1 + wastage / 100);
    this.productForm.get('totalWeight')?.setValue(totalWeight, { emitEvent: false });
  }

  onSubmit() {
    if (this.mode === 'read') return;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.getRawValue();
    
    // Map form fields to API structure
    const apiData = {
      prodIdSeq: this.formData?.prodIdSeq || 0,
      prodId: formValue.productId,
      prodName: formValue.productName,
      rawMaterial: formValue.rawMaterial,
      weight: formValue.weight,
      wastage: formValue.wastage,
      norms: formValue.norms,
      totalWeight: formValue.totalWeight,
      cavity: formValue.cavity,
      shotRate: formValue.shotRate,
      perItemRate: formValue.rate,
      incentiveLimit: formValue.incentiveLimit,
      companyId: 'FINO001',
      createDate: this.formData?.createDate || new Date().toISOString(),
      updateDate: new Date().toISOString()
    };
    
    this.formSubmit.emit(apiData);
  }
}
