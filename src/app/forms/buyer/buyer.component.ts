import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../../components/footer/footer.component';
import { Buyer } from 'src/app/models/buyer.model';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class BuyerComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: Buyer | null = null;
  @Output() formSubmit = new EventEmitter<Buyer>();
  @Output() formClosed = new EventEmitter<void>();

  buyerForm: FormGroup;

  constructor(private location: Location, private fb: FormBuilder) {
    this.buyerForm = this.fb.group({
      buyerId: ['', Validators.required],
      buyerName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gstin: ['']
    });
  }

  ngOnInit() {
    if (this.formData) {
      this.buyerForm.patchValue(this.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.buyerForm.patchValue(this.formData);
      if (this.mode === 'read') {
        this.buyerForm.disable();
      } else {
        this.buyerForm.enable();
      }
    } else if (this.mode === 'create') {
      this.buyerForm.reset();
      this.buyerForm.enable();
    }
  }

  get f() {
    return this.buyerForm.controls;
  }

  goBack() {
    this.formClosed.emit();
  }

  onSubmit() {
    if (this.mode === 'read') {
      return;
    }
    if (this.buyerForm.invalid) {
      this.buyerForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.buyerForm.value);
  }
}
