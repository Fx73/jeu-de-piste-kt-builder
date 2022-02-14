import { RouterModule, Routes } from '@angular/router';

import { EditionPage } from './edition.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: EditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditionPageRoutingModule {}
