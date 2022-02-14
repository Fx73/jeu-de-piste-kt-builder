import { CommonModule } from '@angular/common';
import { EditionPage } from './edition.page';
import { EditionPageRoutingModule } from './edition-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionPageRoutingModule
  ],
  declarations: [EditionPage]
})
export class EditionPageModule {}
