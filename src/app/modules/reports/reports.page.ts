import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements AfterViewInit, OnDestroy {
  @ViewChild('reportChart') reportChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  reports = [
    {
      id: 'invoice',
      name: 'Sales Report',
      preview: '',
      filters: {
        startDate: '',
        endDate: '',
        startDateDisplay: '',
        endDateDisplay: '',
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
        startDateDisplay: '',
        endDateDisplay: '',
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
        startDateDisplay: '',
        endDateDisplay: '',
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
        startDateDisplay: '',
        endDateDisplay: '',
        type: ''
      }
    }
  ];

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

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

  onStartDateChange(report: any, value: any) {
    const iso = typeof value === 'string' ? value : value?.detail?.value;
    report.filters.startDate = iso;
    report.filters.startDateDisplay = this.formatDateDisplay(iso);
  }

  onEndDateChange(report: any, value: any) {
    const iso = typeof value === 'string' ? value : value?.detail?.value;
    report.filters.endDate = iso;
    report.filters.endDateDisplay = this.formatDateDisplay(iso);
  }

  private formatDateDisplay(value: string): string {
    if (!value) return '';
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  }

  private renderChart() {
    if (!this.reportChartRef?.nativeElement) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'Production Summary',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    this.chart = new Chart(this.reportChartRef.nativeElement, config);
  }

}
