import { Component, ViewChild, Input, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RegisterPage } from '../register/register';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { IncomePage } from '../income/income';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = "admin";
  // pass: number = 1234;
  pass = "1234";

  passwordType: string = 'password';
  passwordShow: boolean = false;

  @ViewChild("userInput") _username: any;
  @ViewChild("passInput") _password: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public authService: AuthServiceProvider,
    private userService: UserServiceProvider) {
    // if (localStorage.getItem('auth') != null || localStorage.getItem('auth') != '') {
    //   let result = JSON.parse(localStorage.getItem('auth'))
    //   console.log(result.userid);

    //   let date = this.userService.getDateIncome(new Date());
    //   this.userService.getIncomesByUser(result.userid, date).get().then((docIncome) => {
    //     console.log(docIncome.size);

    //     if (docIncome.size == 0) {
    //       this.navCtrl.push(IncomePage, { result: result })
    //     } else {
    //       this.navCtrl.push(HomePage, { result: result })
    //     }
    //   })
    // }
  }

  togglePassword() {
    if (this.passwordShow) {
      this.passwordShow = false;
      this.passwordType = 'password';
      // console.log('2');
    } else {
      // console.log('1');
      this.passwordShow = true;
      this.passwordType = 'text';
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    // console.log(this.user);

    // if (localStorage.getItem("auth") == this.user) {
    //   this.navCtrl.push(HomePage);
    // }
  }

  regis() {
    this.navCtrl.push(RegisterPage);
  }

  onClickLoginBtn(user, pass) {

    // this.authService.login(user, pass, (result) => {
    //   if (result) {
    //     let toast = this.toastCtrl.create({
    //       message: 'ยินดีตอนรับสู่ระบบ',
    //       duration: 3000,
    //       position: 'top'
    //     });
    //     toast.present();

    //     this.navCtrl.push(HomePage, {
    //       result: {
    //         "useradmin": this._username.value
    //       }
    //     })
    //   }
    //   else if (user == "") {
    //     let toast = this.toastCtrl.create({
    //       message: 'กรุณากรอก Username และ Password',
    //       duration: 3000,
    //       position: 'top'
    //     });
    //     toast.present();
    //   }
    //   else if (pass == "") {
    //     let toast = this.toastCtrl.create({
    //       message: 'กรุณากรอก Password',
    //       duration: 3000,
    //       position: 'top'
    //     });
    //     toast.present();
    //   }
    //   else {
    //     let toast = this.toastCtrl.create({
    //       message: 'ผิด',
    //       duration: 3000,
    //       position: 'top'
    //     });
    //     toast.present();
    //   }
    // })

    if (user == "") {
      let toast = this.toastCtrl.create({
        message: 'กรุณากรอก Username และ Password',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else if (pass == "") {
      let toast = this.toastCtrl.create({
        message: 'กรุณากรอก Password',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      this.authService.login(this._username.value, this._password.value).get().then((docUser) => {
        console.log(docUser.size);

        if (docUser.size == 1) {
          console.log(docUser.docs[0].data());

          let date = this.userService.getDateIncome(new Date());
          console.log(date);

          this.userService.getIncomesByUser(docUser.docs[0].id, date).get().then((docIncome) => {
            let toast = this.toastCtrl.create({
              message: 'ยินดีตอนรับสู่ระบบ',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            localStorage.setItem('auth', JSON.stringify(
              {
                "useradmin": this._username.value,
                "userid": docUser.docs[0].id
              }
            ))
            if (docIncome.size == 0) {
              this.navCtrl.push(IncomePage, {
                result: {
                  "useradmin": this._username.value,
                  "userid": docUser.docs[0].id
                }
              })
            } else {
              this.navCtrl.push(HomePage, {
                result: {
                  "useradmin": this._username.value,
                  "userid": docUser.docs[0].id
                }
              })
            }

          })
        } else {
          let toast = this.toastCtrl.create({
            message: 'ผิด',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      })
    }
  }

}
