import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, NavParams, Slide, Slides, LoadingController, Loading } from 'ionic-angular';
import { ShoppingPage } from '../shopping/shopping';
import { FoodPricesPage } from '../food-prices/food-prices';
import { TravelingPage } from '../traveling/traveling';
import { ExpensesPage } from '../expenses/expenses';
import { PetFeePage } from '../pet-fee/pet-fee';
import { OtherPage } from '../other/other';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Chart } from 'chart.js';
import { IncomePage } from '../income/income';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { async } from '@firebase/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slider') slider: Slides;
  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef;
  @ViewChild('doughnutCanvasY') doughnutCanvasY: ElementRef;
  @ViewChild('barCanvas') barCanvas: ElementRef;
  @ViewChild('barCanvasYear') barCanvasYear: ElementRef;

  barChart: any;
  doughnutChart: any;
  barChartYear: any;
  doughnutChartY: any;
  page = 'home';
  out = "";
  user = "admin";
  tableblue: boolean = false;
  loading: any;

  label = ["shopping", "pet", "food", "expenses", "other", "travel"];
  data = [];
  dataIncome = [];

  labelY = []
  dataY = []
  dataIncomeY = [];

  income: number = 0;
  expenses: number = 0;
  sum: number = 0;

  incomeY: number = 0;
  expensesY: number = 0;
  sumY: number = 0;

  public dateselected: any;
  public showdate: boolean = false;
  public date2: string
  public dateshow: Date

  monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  monthText: string;

  result: {
    useradmin: string,
    userid: string
  }

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    public loadingCtrl: LoadingController) {

    if (localStorage.getItem('auth') != null) {
      console.log(this.result);
      this.result = JSON.parse(localStorage.getItem('auth'))
      // console.log(result.userid);

      // this.result = result;
      console.log(this.result);

    }
    console.log(this);

  }

  segmentChanged(ev: any) {

    if (this.page == 'stats') {
      this.dateshow = new Date();
      this.date2 = this.formarDate(this.dateshow);
      this.monthText = this.monthNames[this.dateshow.getMonth()]
      this.getData(new Date())
    }


  }

  async getData(date) {
    let loading = await this.loadingCtrl.create({
      content: 'Loading..',
      spinner: 'circles'
    });

    await loading.present().then(async () => {
      await this.getArrChart(date)
      await this.checkExpenses()
      await this.getIncome_ExpensesYear(date)
      await this.getArrYear(date)
      await loading.dismiss();
    });
  }
  selectedTab(index) {
    this.slider.slideTo(index);
  }
  ionViewDidLoad = () => {
    console.log('89 home');
    // if (this.navParams.get("result")) {
    //   this.result = this.navParams.get("result");
    // }
    // this.getArrChart(new Date())
    // this.checkExpenses()
  }
  ionViewWillEnter() {
    console.log('92 home');
    // if (localStorage.getItem('auth') != this.user) {
    //   this.navCtrl.push(LoginPage);
    // }
    if (this.navParams.get("result")) {
      this.result = this.navParams.get("result");
    }
    // this.navCtrl.push(IncomePage)
    // this.out = localStorage.getItem("auth");
  }
  // ionViewDidEnter() {
  //   alert("Welcome" + this.result.useradmin);
  // }

  onClickshopBtn() {
    this.navCtrl.push(ShoppingPage, { result: this.result });
    // this.navCtrl.push(IncomePage);
    this.tableblue = true;
  }
  onClickfoodBtn() {
    this.navCtrl.push(FoodPricesPage, { result: this.result });
  }
  onClicktravelBtn() {
    this.navCtrl.push(TravelingPage, { result: this.result });
  }
  onClickexpensesBtn() {
    this.navCtrl.push(ExpensesPage, { result: this.result });
  }
  onClickpetBtn() {
    this.navCtrl.push(PetFeePage, { result: this.result });
  }
  onClickotherBtn() {
    this.navCtrl.push(OtherPage, { result: this.result });
  }

  logoutBtn() {
    this.authService.logout(exit => {
      this.navCtrl.push(LoginPage);
    });
  }

  getArrChart = (d) => {
    // console.log(this);
    let loading = this.loadingCtrl.create({
      content: 'Loading..',
      spinner: 'circles'
    });
    loading.present().then(() => {
      let date = this.userService.getDateIncome(d)
      this.userService.createArrLabel(date, this.result.userid, this.label, (label, data, income, i) => {
        console.log(label);
        console.log(data);
        console.log(income);

        this.label = label;
        this.data = data;
        this.dataIncome = income;
        var controlData = {
          label: 'จำนวนเงินที่ควบคุม',
          data: this.dataIncome,
          backgroundColor: 'rgba(0, 99, 132, 0.6)',
          borderWidth: 0,
          // yAxisID: "y-axis-control"
        };

        var paymentData = {
          label: 'จำนวนเงินที่ใช้จ่าย',
          data: this.data,
          backgroundColor: 'rgba(99, 132, 0, 0.6)',
          borderWidth: 0,
          // yAxisID: "y-axis-payment"
        };

        var planetData = {
          labels: this.label,
          datasets: [controlData, paymentData]
        };

        var chartOptions = {
          scales: {
            xAxes: [{
              barPercentage: 1,
              categoryPercentage: 0.6
            }],
            yAxes: [{

              ticks: {
                beginAtZero: true
              }

            }]
          }
        };

        this.barChart = new Chart(this.barCanvas.nativeElement, {

          type: 'bar',
          data: planetData,
          options: chartOptions
        });

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

          type: 'doughnut',
          data: {
            labels: this.label,
            datasets: [{
              label: '# of Votes',
              data: this.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }]
          }

        });
        if(i + 1 == this.label.length){
          loading.dismiss();
        }
      });
    })
  }

  dateBack() {
    this.dateshow.setMonth(this.dateshow.getMonth() - 1);
    this.date2 = this.formarDate(this.dateshow);
    this.getData(this.date2)
    this.monthText = this.monthNames[this.dateshow.getMonth()]
  }
  dateNext() {
    this.dateshow.setMonth(this.dateshow.getMonth() + 1);
    this.date2 = this.formarDate(this.dateshow);
    this.getData(this.date2)
    this.monthText = this.monthNames[this.dateshow.getMonth()]
  }
  dateSelected(result: any) {
    console.log(result);

    this.dateshow = result;
    this.date2 = this.formarDate(result)
    this.showdate = false;
    this.getData(this.date2)
    this.monthText = this.monthNames[this.dateshow.getMonth()]
    // console.log(this.dateselected.toLocaleString())
  }
  showDate() {
    this.showdate = true;
  }

  checkExpenses() {

    this.userService.checkExpensesAll(this.result.userid, this.date2, (income, expenses) => {
      console.log(income);

      this.income = income;
      this.expenses = expenses;
      this.sum = income - expenses;
    })
  }

  formarDate(d) {
    return d.getFullYear() + '/' + (d.getMonth() + 1)
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'circles',
    });
    // loading.present();


    // let loading = this.loadingCtrl.create({
    //   content: 'Loading..',
    //   spinner: 'circles'
    // });
    // loading.present();
    // });
  }

  getIncome_ExpensesYear(date) {
    this.userService.getIncomeYear(this.result.userid, date, (income, expenses) => {
      console.log(income);
      console.log(expenses);
      this.incomeY = income;
      this.expensesY = expenses;
      this.sumY = income - expenses;

    })
  }

  getArrYear(date) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      spinner: 'circles',
    });

    loading.present().then(() => {
      this.userService.arrYear(this.result.userid, date, (income, expenses, label) => {
        console.log(income);
        console.log(expenses);
        console.log(label);

        this.dataIncomeY = income;
        this.dataY = expenses;
        this.labelY = label;

        var controlData = {
          label: 'จำนวนเงินที่ควบคุม',
          data: this.dataIncomeY,
          backgroundColor: 'rgba(0, 99, 132, 0.6)',
          borderWidth: 0,
          // yAxisID: "y-axis-control"
        };

        var paymentData = {
          label: 'จำนวนเงินที่ใช้จ่าย',
          data: this.dataY,
          backgroundColor: 'rgba(99, 132, 0, 0.6)',
          borderWidth: 0,
          // yAxisID: "y-axis-payment"
        };

        var planetData = {
          labels: this.labelY,
          datasets: [controlData, paymentData]
        };

        var chartOptions = {
          scales: {
            xAxes: [{
              barPercentage: 1,
              categoryPercentage: 0.6
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        };

        this.barChartYear = new Chart(this.barCanvasYear.nativeElement, {

          type: 'bar',
          data: planetData,
          options: chartOptions
        });

        this.doughnutChartY = new Chart(this.doughnutCanvasY.nativeElement, {

          type: 'doughnut',
          data: {
            labels: this.labelY,
            datasets: [{
              label: '# of Votes',
              data: this.dataY,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }]
          }

        });
      })

      loading.dismiss();
    })

  }

}
