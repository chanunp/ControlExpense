import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-income',
  templateUrl: 'income.html',
})
export class IncomePage {
  _shop: string = ''
  _food: string = ''
  _travel: string = ''
  _expenses: string = ''
  _pet: string = ''
  _other: string = ''
  sum: string = ''

  date: Date;

  result: {
    useradmin: string
    userid: string
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private userService: UserServiceProvider) {
    if (localStorage.getItem('auth') != null) {
      console.log(this.result);

      this.result = JSON.parse(localStorage.getItem('auth'))
      // console.log(result.userid);

      // this.result = result;
      console.log(this.result);

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IncomePage');
  }
  onClickSubmitBtn() {
    console.log("onClickSubmitBtn");
    console.log(this._shop);
    if (this._shop == '' || this._food == '' || this._expenses == '' || this._travel == '' || this._pet == '' || this._other == '') {
      let alert = this.alertCtrl.create({
        title: 'ตรวจสอบข้อมูล',
        subTitle: 'กรุณากรอกจำนวนที่ควบคุมแต่ละเมนูให้ครบด้วยค่ะ!',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if (+this._shop < 0 || +this._food < 0 || +this._expenses < 0 || +this._travel < 0 || +this._pet < 0 || +this._other < 0) {
        let alert = this.alertCtrl.create({
          title: 'ตรวจสอบข้อมูล',
          subTitle: 'จำนวนที่ควบคุมต้องมากกว่า 0',
          buttons: ['OK']
        });
        alert.present();
      } else {
        let date = this.userService.getDateIncome(new Date());

        this.userService.createIncome(date, +this._shop, +this._food, +this._travel, +this._expenses, +this._pet, +this._other, this.result.userid).then(() => {
          console.log('create incomes success.');
          this.navCtrl.push(HomePage, { result: this.result })
        })
      }
      // this.sum = parseFloat(this._shop) + parseFloat(this._food) + parseFloat(this._travel) + parseFloat(this._expenses) + parseFloat(this._pet) + parseFloat(this._other.value);
    }
  }

  ionViewWillEnter() {

    this.date = new Date();

    if (this.navParams.get('result')) {
      this.result = this.navParams.get('result')
    } //login->income.

    this.userService.checkIncomeAgo(this.result.userid, this.date.getFullYear() + '-' + this.date.getMonth()).get().then(incomeDoc => {
      if (incomeDoc.size > 0) {
        incomeDoc.forEach(inc => {
          this.userService.getTypeByIncomes(this.result.userid, inc.id).get().then((typeInc) => {
            typeInc.forEach(type => {
              let t = type.data()
              this._shop = t.shop + ''
              this._food = t.food + ''
              this._travel = t.travel + ''
              this._expenses = t.expenses + ''
              this._pet = t.pet + ''
              this._other = t.other + ''
            })
          })

        })
      }
    })
  }

}
