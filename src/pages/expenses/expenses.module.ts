import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpensesPage } from './expenses';
import { DatePicker } from "@ionic-native/date-picker";
import { DatePickerModule } from 'ionic-calendar-date-picker';

@NgModule({
  declarations: [
    ExpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpensesPage),
    DatePickerModule,
    DatePicker,
  ],
})
export class ExpensesPageModule { }
