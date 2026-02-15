import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMastersPage } from './profile-masters.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileMastersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileMastersPageRoutingModule {}
