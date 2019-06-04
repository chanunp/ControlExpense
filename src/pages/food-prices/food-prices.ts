import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { DateProvider } from '../../providers/date/date';

@IonicPage()
@Component({
  selector: 'page-food-prices',
  templateUrl: 'food-prices.html',
})
export class FoodPricesPage {
  overlap: boolean = false;
  public dateselected: any;
  public showdate: boolean = false;
  public date2: string;
  public dateshow: Date;
  public datenow: Date;
  public datenow2: string;

  cd: number = 0;

  result: {
    useradmin: string,
    userid: string
  }

  income: number = 0;
  expenses: number = 0;
  sum: number = 0;
  list = [];

  money: string = '';
  description: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    private userServie: UserServiceProvider,
    private altClt: AlertController,
    private dateService: DateProvider,
    public actionSheetCtrl: ActionSheetController) {

    this.dateshow = new Date();
    this.date2 = this.formarDate(this.dateshow)
    this.datenow = new Date();
  }

  ionViewDidLoad() {
    this.result = this.navParams.get("result");
    console.log(this.result);
    this.checkExpenses()
  }

  showDate() {
    this.showdate = true;
  }
  dateBack() {
    this.dateshow.setDate(this.dateshow.getDate() - 1);
    this.date2 = this.formarDate(this.dateshow)
    this.checkExpenses()
    this.dateService.checkdate(this.dateshow.toDateString(), result => {
      this.overlap = result;
    })
  }
  dateNext() {
    this.dateshow.setDate(this.dateshow.getDate() + 1);
    this.date2 = this.formarDate(this.dateshow)
    this.checkExpenses()
    this.dateService.checkdate(this.dateshow.toDateString(), result => {
      this.overlap = result;
    })
  }
  dateSelected(result: any) {
    this.dateshow = result;
    this.date2 = this.formarDate(result)
    this.showdate = false;
    this.checkExpenses()
    // console.log(this.dateselected.toLocaleString())
    this.dateService.checkdate(this.dateshow.toDateString(), result => {
      this.overlap = result;
    })
  }

  addExpenses() {
    if (this.money == '' || this.description == '') {
      this.altClt.create({
        title: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        buttons: ['OK']
      }).present()
      this.description = '';
      this.money = '';
    }
    else if (+this.money < 0) {
      this.altClt.create({
        title: 'กรุณาเพิ่มรายจ่ายที่มากกว่า 0',
        buttons: ['OK']
      }).present()
      this.description = '';
      this.money = '';
    } else {
      if (this.cd == 0) {
        this.altClt.create({
          title: 'Error !!!',
          subTitle: 'ไม่มีข้อมูลการกรอกจำนวนที่ควบคุมไว้ในเดือนนี้',
          buttons: ['OK']
        }).present()
        this.description = '';
        this.money = '';
      } else {
        this.userServie.addExpenses(this.result.userid, 'food', this.description, this.money, this.date2, (docRef) => {
          if (this.sum < 0) {
            this.altClt.create({
              title: 'ค่าใช้จ่ายเกินจำนวนที่ควบคุมของเมนูนี้แล้ว!!!!',
              cssClass: 'custom-alertDanger',
              buttons: ['OK']
            }).present()
          }
          // else {
          // this.altClt.create({
          //   title: 'เพิ่มรายการเรียบร้อย',
          //   buttons: ['OK']
          // }).present(

          // }
        })
        this.description = '';
        this.money = '';
      }
    }
  }

  checkExpenses() {

    this.userServie.checkExpenses(this.result.userid, 'food', this.date2, (income, expenses, arr, cd) => {
      this.income = income;
      this.expenses = expenses;
      this.sum = income - expenses;
      this.list = arr;
      this.cd = cd;
    })
  }

  formarDate(d) {
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  }

  deleteItem(item) {
    console.log(item);
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log('Archive clicked');
            this.userServie.deleteDetail(this.date2, 'food', item.id, this.result.userid).then((doc) => {
              this.checkExpenses();

            })
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).present()
  }

}
