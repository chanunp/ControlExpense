import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelingPage } from './traveling';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { DatePicker } from "@ionic-native/date-picker";

@NgModule({
  declarations: [
    TravelingPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelingPage),
    DatePickerModule,
    DatePicker,
  ],

})
export class TravelingPageModule { }
