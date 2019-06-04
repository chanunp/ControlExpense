import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherPage } from './other';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { DatePicker } from "@ionic-native/date-picker";

@NgModule({
  declarations: [
    OtherPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherPage),
    DatePickerModule,
    DatePicker,
  ],
})
export class OtherPageModule { }
