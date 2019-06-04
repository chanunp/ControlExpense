import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ShoppingPage } from '../pages/shopping/shopping';
import { IncomePage } from '../pages/income/income';
import { FoodPricesPage } from '../pages/food-prices/food-prices';
import { TravelingPage } from '../pages/traveling/traveling';
import { ExpensesPage } from '../pages/expenses/expenses';
import { PetFeePage } from '../pages/pet-fee/pet-fee';
import { OtherPage } from '../pages/other/other';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpClientModule } from '@angular/common/http';

import { DatePicker } from "@ionic-native/date-picker";
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { RegisterPage } from '../pages/register/register';

import { firebaseConfig } from './credentials';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { DateProvider } from '../providers/date/date';

// import { CalendarModule, CalenderDateFormatter, CalenderEventTitleFormatter } from '@ionic-native/calendar';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ShoppingPage,
    IncomePage,
    FoodPricesPage,
    TravelingPage,
    ExpensesPage,
    PetFeePage,
    OtherPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    HttpClientModule,
    DatePickerModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ShoppingPage,
    IncomePage,
    FoodPricesPage,
    TravelingPage,
    ExpensesPage,
    PetFeePage,
    OtherPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    UserServiceProvider,
    DateProvider
  ]
})
export class AppModule { }
