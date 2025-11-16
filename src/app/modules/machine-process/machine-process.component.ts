import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { Location, CommonModule } from '@angular/common';
import { Machine } from 'src/app/models/machine.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-machine-process',
  templateUrl: './machine-process.component.html',
  styleUrls: ['./machine-process.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MachineProcessComponent implements OnInit {

  // simple model bound to the template (can be used with [(ngModel)])
  formData: Machine = {
    machineId: '',
    machineName: '',
    workType: '',
    shortName: '',
    process: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  // call this from your template e.g. (ngSubmit)="submit(processForm)" or (click)="submit()"
  async submit(data?: any) {
    const payload = data ?? this.formData;
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = null;

    try {
      // safe stringify that drops circular references
      const safeStringify = (obj: any) => {
        const seen = new WeakSet();
        return JSON.stringify(obj, (_key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return; // drop circular reference
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
      // optionally reset the form model:
      // this.formData = { machineId: '', machineName: '', workType: '', shortName: '', process: '' };
      console.log('Submit result:', result);
    } catch (err: any) {
      this.isSubmitting = false;
      this.submitError = err?.message || 'Submission failed';
      console.error('Submit error:', err);
    }
  }
}
