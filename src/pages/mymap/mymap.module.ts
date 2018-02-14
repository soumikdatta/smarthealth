import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MymapPage } from './mymap';

@NgModule({
  declarations: [
    MymapPage,
  ],
  imports: [
    IonicPageModule.forChild(MymapPage),
  ],
})
export class MymapPageModule {}
