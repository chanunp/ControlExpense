import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShoppingPage } from './shopping';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { DatePicker } from "@ionic-native/date-picker";

@NgModule({
  declarations: [
    ShoppingPage,
  ],
  imports: [
    IonicPageModule.forChild(ShoppingPage),
    DatePickerModule,
    DatePicker,
  ],
})
export class ShoppingPageModule { }
