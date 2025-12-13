import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-machine-process',
  templateUrl: './machine-process.component.html',
  styleUrls: ['./machine-process.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class MachineProcessComponent implements OnChanges {
  @Input() mode: 'create' | 'read' | 'update' | null = 'create';
  @Input() formData: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  processForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private navCtrl: NavController) {
    this.processForm = this.fb.group({
      machineId: ['', Validators.required],
      machineName: ['', Validators.required],
      workType: ['', Validators.required],
      shortName: [''],
      process: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.processForm.patchValue(this.formData);
      if (this.mode === 'read') {
        this.processForm.disable();
      } else {
        this.processForm.enable();
      }
    } else if (this.mode === 'create') {
      this.processForm.reset();
      this.processForm.enable();
    }
  }

  goBack() {
    // this.router.navigate(['/machine-process']);
    this.navCtrl.back();
  }

  submit() {
    if (this.mode !== 'read' && this.processForm.valid) {
      this.isSubmitting = true;
      this.formSubmit.emit(this.processForm.value);
      this.isSubmitting = false;
    }
  }
}
