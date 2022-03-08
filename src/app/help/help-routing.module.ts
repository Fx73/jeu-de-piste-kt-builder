import { RouterModule, Routes } from '@angular/router';

import { ConditionsPage } from './conditions/conditions.page';
import { HelpPage } from './help.page';
import { NgModule } from '@angular/core';
import { PrivacyPage } from './privacy/privacy.page';

const routes: Routes = [
  {
    path: '',
    component: HelpPage,
  },
  {
    path: 'Conditions',
    loadChildren: () => import('./conditions/conditions.module').then( m => m.ConditionsPageModule)
  },
  {
    path: 'Privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpPageRoutingModule {}
