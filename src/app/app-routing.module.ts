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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
