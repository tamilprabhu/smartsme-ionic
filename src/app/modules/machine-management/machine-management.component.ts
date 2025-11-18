import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Machine } from 'src/app/models/machine.model';

@Component({
  selector: 'app-machine-management',
  templateUrl: './machine-management.component.html',
  styleUrls: ['./machine-management.component.scss'],
  standalone: false
})
export class MachineManagementComponent {
  machines: Machine[] = [];
  formMode: 'create' | 'read' | 'update' | null = null;
  selectedMachine: Machine | null = null;
  showForm = false;

  constructor(private alertController: AlertController, private navCtrl: NavController) {
    // Sample data
    this.machines = [
      { machineId: 'M001', machineName: 'Cutter', workType: 'Cutting', shortName: 'Cut', process: 'Cut Process' },
      { machineId: 'M002', machineName: 'Welder', workType: 'Welding', shortName: 'Wld', process: 'Weld Process' }
    ];
  }

  ngOnInit() {
    console.log('Machine Management Component Initialized');
  }

  openCreateForm() {
    this.selectedMachine = null;
    this.formMode = 'create';
    this.showForm = true;
  }

  openReadForm(machine: Machine) {
    this.selectedMachine = machine;
    this.formMode = 'read';
    this.showForm = true;
  }

  openUpdateForm(machine: Machine) {
    this.selectedMachine = machine;
    this.formMode = 'update';
    this.showForm = true;
  }

  async confirmDelete(machine: Machine) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete machine "${machine.machineName}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteMachine(machine);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteMachine(machine: Machine) {
    this.machines = this.machines.filter(m => m.machineId !== machine.machineId);
  }

  handleFormSubmit(formData: Machine) {
    if (this.formMode === 'create') {
      // Add new machine
      this.machines.push(formData);
    } else if (this.formMode === 'update' && this.selectedMachine) {
      // Update existing machine
      const index = this.machines.findIndex(m => m.machineId === this.selectedMachine?.machineId);
      if (index > -1) {
        this.machines[index] = formData;
      }
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    this.selectedMachine = null;
    this.formMode = null;
  }

  goBack() {
    this.navCtrl.back();
  }
}
