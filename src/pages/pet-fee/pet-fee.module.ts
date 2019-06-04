import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetFeePage } from './pet-fee';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { DatePicker } from "@ionic-native/date-picker";

@NgModule({
  declarations: [
    PetFeePage,
  ],
  imports: [
    IonicPageModule.forChild(PetFeePage),
    DatePickerModule,
    DatePicker,
  ],
})
export class PetFeePageModule { }
