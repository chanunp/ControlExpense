import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodPricesPage } from './food-prices';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { DatePicker } from "@ionic-native/date-picker";

@NgModule({
  declarations: [
    FoodPricesPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodPricesPage),
    DatePickerModule,
    DatePicker,
  ],
})
export class FoodPricesPageModule { }
