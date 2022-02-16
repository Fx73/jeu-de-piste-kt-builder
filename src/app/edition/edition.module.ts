import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
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
    EditionPageRoutingModule,
    DragDropModule
  ],
  declarations: [EditionPage]
})
export class EditionPageModule {}
