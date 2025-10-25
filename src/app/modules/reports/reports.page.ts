import { Component } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: false,
})
export class ReportsPage {

  reports = [
    {
      id: 'invoice',
      name: 'Sales Report',
      preview: '',
      filters: {
        startDate: '',
        endDate: '',
        type: ''
      }
    },
    {
      id: 'dispatch',
      name: 'Inventory Report',
      preview: '',
      filters: {
        startDate: '',
        endDate: '',
        type: ''
      }
    },
    {
      id: 'production',
      name: 'Expenses Report',
      preview: '',
      filters: {
        startDate: '',
        endDate: '',
        type: ''
      }
    },
    {
      id: 'products',
      name: 'Products Report',
      preview: '',
      filters: {
        startDate: '',
        endDate: '',
        type: ''
      }
    }
  ];

  // Load report preview when accordion opens
  async handleAccordionChange(ev: any) {
    const opened = ev.detail.value;
    if (opened) {
      const report = this.reports.find(r => r.id === opened);
      if (report && !report.preview) {
        report.preview = await this.loadReportData(report.id);
      }
    }
  }

  // Simulated backend call
  async loadReportData(reportId: string): Promise<string> {
    const data = {
      invoice: 'Sales invoice summary for Q3...',
      dispatch: 'Dispatch data overview...',
      production: 'Production entry analysis...',
      products: 'Product details...',
    };
    return new Promise(resolve => {
      setTimeout(() => resolve(data[reportId as keyof typeof data] || 'No data found.'), 500);
    });
  }

}
