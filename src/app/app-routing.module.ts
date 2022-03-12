import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Edition',
    pathMatch: 'full'
  },
  {
    path: 'Edition/:id',
    loadChildren: () => import('./edition/edition.module').then( m => m.EditionPageModule)
  },
  {
    path: 'Help',
    loadChildren: () => import('./Help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'Account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'Login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
