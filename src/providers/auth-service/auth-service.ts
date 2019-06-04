import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  user = "admin";
  // pass: number = 1234;
  pass = "1234";
  private log: boolean = false;

  constructor(public http: HttpClient, private db: AngularFirestore) {
    console.log('Hello AuthServiceProvider Provider');
  }

  login(user, pass) {
    // if (user == this.user && pass == this.pass) {
    //   localStorage.setItem("auth", user);
    //   this.log = true;
    //   return callback(this.log);
    // } else {
    //   this.log = false;
    //   return callback(this.log);
    // }

    return firebase.firestore().collection('users').where('username', '==', user).where('password', '==', pass)

  }

  logout(callback) {

    localStorage.removeItem('auth');
    this.log = false;
    return callback(false);
  }
  
  Isaleadylog(callback) {
    return callback(this.log);
  }

}
