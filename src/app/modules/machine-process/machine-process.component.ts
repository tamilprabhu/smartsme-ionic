import { Component, OnInit } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../components/footer/footer.component';
import { Machine } from 'src/app/models/machine.model';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-machine-process',
  templateUrl: './machine-process.component.html',
  styleUrls: ['./machine-process.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule, FooterComponent]
})
export class MachineProcessComponent implements OnInit {
  processForm: FormGroup;

  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(private location: Location, private fb: FormBuilder) {
    this.processForm = this.fb.group({
      machineId: ['', Validators.required],
      machineName: ['', Validators.required],
      workType: ['', Validators.required],
      shortName: [''],
      process: ['']
    });
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  async submit() {
    if (this.processForm.invalid) {
      this.processForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = null;

    try {
      const payload = this.processForm.value;

      const safeStringify = (obj: any) => {
        const seen = new WeakSet();
        return JSON.stringify(obj, (_key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
          }
          return value;
        });
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: safeStringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const result = await res.json().catch(() => null);
      this.isSubmitting = false;
      this.submitSuccess = true;
      console.log('Submit result:', result);
      // Optionally reset form here: this.processForm.reset();
    } catch (err: any) {
      this.isSubmitting = false;
      this.submitError = err?.message || 'Submission failed';
      console.error('Submit error:', err);
    }
  }
}
