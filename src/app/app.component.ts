import { Component } from '@angular/core';
import { Platform, NavController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { IncomePage } from '../pages/income/income';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { HomePage } from '../pages/home/home';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private userService: UserServiceProvider,
    public loadingCtrl: LoadingController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // let loading = this.loadingCtrl.create({
      //   content: 'Loading..',
      //   spinner: 'circles'
      // });
      // loading.present();

      if (localStorage.getItem('auth') != null) {

        let result = JSON.parse(localStorage.getItem('auth'))
        console.log(result.userid);

        let date = this.userService.getDateIncome(new Date());
        this.userService.getIncomesByUser(result.userid, date).get().then((docIncome) => {
          console.log(docIncome.size);

          if (docIncome.size == 0) {
            this.rootPage = IncomePage;
          } else {
            this.rootPage = HomePage;
          }
        })

      } else {
        this.rootPage = LoginPage;
      }
      // loading.dismiss();
    });
  }
}
