import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DateProvider {

  public datenow: Date;
  public datenow2: string;
  constructor(public http: HttpClient) {
    console.log('Hello DateProvider Provider');
  }

  checkdate(day, callback) {
    this.datenow = new Date();
    this.datenow2 = this.datenow.toDateString();
    let s = day.split(" ");
    let m = this.datenow2.split(" ");
    if (s[2] > m[2]) {
      return callback(true);
    } else {
      return callback(false);
    }
  }
}
