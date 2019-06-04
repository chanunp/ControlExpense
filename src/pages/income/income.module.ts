import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomePage } from './income';

@NgModule({
  declarations: [
    IncomePage,
  ],
  imports: [
    IonicPageModule.forChild(IncomePage),
  ],
})
export class IncomePageModule {}
