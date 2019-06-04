import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user-model';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  @ViewChild("conpass") _conpass: any;

  checkvalid: FormGroup;
  submitted: boolean = false;
  checktel: boolean = false;

  user: User = new User();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private userService: UserServiceProvider) {

    this.checkvalid = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      tel: ['', Validators.required],
      username: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  checkPass() {
    if (this.user.password != this._conpass.value) {
      let alert = this.alertCtrl.create({
        title: 'Error Password',
        subTitle: 'password do not match, please fill password again',
        buttons: ['OK']
      });
      alert.present();

      this._conpass.value = "";

    }
  }

  registerBtn(valid) {
    // this.submitted = true;
    console.log(valid);

    console.log(this.user.username == '');
    console.log(this.user.tel);
    console.log(this.user.password);
    console.log(this.user.name);
    console.log(this.user.email);

    if (!valid.valid) {

      this.submitted = true;
      // this.checktel = true;
      console.log('62');
    } else {
      console.log('66');
      if (this.user.tel.length != 10) {
        let alert = this.alertCtrl.create({
          title: 'ตรวจสอบข้อมูล',
          subTitle: 'กรอกเบอร์โทรศัพท์ 10 ตัว!',
          buttons: ['OK']
        });
        alert.present();
      } else {
        this.userService.getUserByUsername(this.user.username).get().then(docUser => {
          console.log(docUser.size);
          if (docUser.size > 0) {
            let alert = this.alertCtrl.create({
              title: 'ตรวจสอบข้อมูล',
              subTitle: 'Username นี้มีผู้ใช้อยู่แล้ว!',
              buttons: ['OK']
            });
            alert.present();
          } else {
            this.userService.createUser(this.user).then(() => {
              console.log('create success.');
              let alert = this.alertCtrl.create({
                title: 'บันทึกข้อมูลสำเร็จ',
                subTitle: '',
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.navCtrl.push(LoginPage);
                  }
                }]
              });
              alert.present();

            })
          }
        })
      }
    }
    // alert('register');
  }

  validTel() {
    console.log(this.user.tel.length);

    if (this.user.tel.length > 10) {
      this.checktel = true;
    } else {
      this.checktel = false;
    }
  }
}
