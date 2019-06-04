import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
import { User } from '../../models/user-model';
import { async } from '@firebase/util';


/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
    console.log('Hello UserServiceProvider Provider');
  }

  getUserByUsername(username: string) {
    return firebase.firestore().collection('users').where('username', '==', username)
  }

  createUser(user: User) {
    return this.db.collection('users').add({
      email: user.email,
      name: user.name,
      password: user.password,
      tel: user.tel,
      username: user.username
    })
  }

  getIncomesByUser(userid: string, date: string) {
    return firebase.firestore().collection('users').doc(userid).collection('incomes').where('date', '==', date)
  }

  getDateIncome(date) {
    let d = new Date(date);
    return d.getFullYear() + '-' + (d.getMonth() + 1)
  }

  getDateExpense(date) {
    let d = new Date(date);
    return d.getDate()
  }

  createIncome(date, _shop: number, _food: number, _travel: number, _expenses: number, _pet: number, _other: number, userid) {
    return this.db.collection('users').doc(userid).collection('incomes').add({
      date: date
    }).then((docRef) => {
      this.db.collection('users').doc(userid).collection('incomes').doc(docRef.id).collection('types').add({
        expenses: +_expenses,
        food: +_food,
        other: +_other,
        pet: +_pet,
        shop: +_shop,
        travel: +_travel
      })
    }).catch(err => {
      console.log(err);

    })
  }

  getTypeByIncomes(userId, incomesId) {
    return firebase.firestore().collection('users/' + userId + '/incomes/' + incomesId + '/types')
  }

  getExpensesByUser(userid: string, date: string) {
    return firebase.firestore().collection('users').doc(userid).collection('expenses').where('date', '==', date)
  }

  getTypeByExpenses(userId, expensesId, type) {
    return firebase.firestore().collection('users/' + userId + '/expenses/' + expensesId + '/types').where('type', '==', type)
  }

  getTypeAllByExpenses(userId, expensesId) {
    return firebase.firestore().collection('users/' + userId + '/expenses/' + expensesId + '/types')
  }

  getDetailByExpenses(userId, expensesId, typeId) {
    return firebase.firestore().collection('users/' + userId + '/expenses/' + expensesId + '/types/' + typeId + '/details').orderBy('time', 'desc')
  }

  getDetailByExpensesByDay(userId, expensesId, typeId, day) {
    return firebase.firestore().collection('users/' + userId + '/expenses/' + expensesId + '/types/' + typeId + '/details').where('day', '==', day)
  }

  addExpensesByUser(userid, expensesId, typeId, description, money, date2) {
    return this.db.collection('users/' + userid + '/expenses/' + expensesId + '/types/' + typeId + '/details').add({
      day: this.getDateExpense(date2),
      description: description,
      money: +money,
      time: new Date().getTime()
    })
  }

  createExpenses(date, userId) {
    return this.db.collection('users/' + userId + '/expenses').add({
      date: date
    })
  }

  createType(userId, expensesId, type) {
    return this.db.collection('users/' + userId + '/expenses/' + expensesId + '/types').add({
      type: type
    })
  }

  addExpenses(userid, type, description, money, date2, callback) {
    let date = this.getDateIncome(date2)
    return this.getExpensesByUser(userid, date).get().then((docRef) => {
      if (docRef.size == 1) {
        this.getTypeByExpenses(userid, docRef.docs[0].id, type).get().then((docRefType) => {
          if (docRefType.size == 1) {
            this.addExpensesByUser(userid, docRef.docs[0].id, docRefType.docs[0].id, description, money, date2).then((detailDoc) => {
              return callback(detailDoc);
            })
          } else {
            this.createType(userid, docRef.docs[0].id, type).then((Tydoc) => {
              this.addExpensesByUser(userid, docRef.docs[0].id, Tydoc.id, description, money, date2).then((detailDoc) => {
                return callback(detailDoc);
              })
            })
          }
        })
      } else {
        this.createExpenses(date, userid).then(ExRef => {
          this.getTypeByExpenses(userid, ExRef.id, type).get().then((docRefType) => {
            if (docRefType.size == 1) {
              this.addExpensesByUser(userid, ExRef.id, docRefType.docs[0].id, description, money, date2).then((detailDoc) => {
                return callback(detailDoc);
              })
            } else {
              this.createType(userid, ExRef.id, type).then((Tydoc) => {
                this.addExpensesByUser(userid, ExRef.id, Tydoc.id, description, money, date2).then((detailDoc) => {
                  return callback(detailDoc);
                })
              })
            }
          })
        })
      }
    })
  }

  checkExpenses(userid, type, date2, callback) {
    let date = this.getDateIncome(date2);
    let day = this.getDateExpense(date2)
    let income = 0;
    this.getIncomesByUser(userid, date).get().then((docRef) => {
      if (docRef.size == 1) {
        this.getTypeByIncomes(userid, docRef.docs[0].id).get().then((docRefIncomes) => {
          if (docRefIncomes.size == 1) {
            income = this.typeIncome(type, docRefIncomes.docs[0].data())
            this.getExpensesByUser(userid, date).onSnapshot((docRefExp) => {
              if (docRefExp.size == 1) {
                this.getTypeByExpenses(userid, docRefExp.docs[0].id, type).onSnapshot(docRefType => {
                  if (docRefType.size == 1) {
                    this.getDetailByExpenses(userid, docRefExp.docs[0].id, docRefType.docs[0].id).onSnapshot(data => {
                      let expenses = 0;
                      let arr = [];
                      data.forEach(doc => {
                        expenses += doc.data().money
                        if (day == doc.data().day) {
                          arr.push({ data: doc.data(), id: doc.id })
                        }
                      })
                      return callback(income, expenses, arr, 1);
                    })
                  } else {
                    return callback(income, 0, [], 1);
                  }
                })
              } else {
                return callback(income, 0, [], 1);
              }
            })
          } else {
            return callback(income, 0, [], 0);
          }
        })
      } else {
        return callback(income, 0, [], 0);
      }
    })
  }

  createArrLabel(date, userId, arrLabel, callback) {
    let arrIn = []
    let arr = []
    this.getIncomesByUser(userId, date).get().then((docIn) => {
      if (docIn.size == 1) {
        this.getTypeByIncomes(userId, docIn.docs[0].id).get().then((docTypeIn) => {
          if (docTypeIn.size == 1) {

            arrLabel.forEach((typeIn, i) => {
              console.log(typeIn);

              arrIn[i] = (this.typeIncome(typeIn, docTypeIn.docs[0].data()));

              this.getExpensesByUser(userId, date).get().then((EXRef) => {
                if (EXRef.size == 1) {
                  this.getTypeByExpenses(userId, EXRef.docs[0].id, typeIn).get().then(async (TypeRef) => {
                    if (TypeRef.size > 0) {
                      let c = 0;
                      let ex = 0;
                      TypeRef.forEach(async (type) => {
                        this.getDetailByExpenses(userId, EXRef.docs[0].id, type.id).get().then((detailsRef) => {
                          ex = 0;
                          c += 1;

                          detailsRef.forEach((detail) => {
                            ex += detail.data().money

                          })
                          arr[i] = (ex)
                          // arrLabel.push(type.data().type)
                          // arrIn.push(this.typeIncome(type.data().type, docTypeIn.docs[0].data()))
                          if (c == TypeRef.size) {
                            return callback(arrLabel, arr, arrIn, i)
                          }
                        })
                      })
                    } else {
                      return callback(arrLabel, arr, arrIn, i)
                    }
                  })
                } else {
                  return callback(arrLabel, arr, arrIn, i)
                }
              })
            })

          } else {
            return callback(arrLabel, arr, arrIn, arrLabel.length - 1)
          }
        })
      } else {
        return callback(arrLabel, arr, arrIn, arrLabel.length - 1)
      }
    })
  }

  checkExpensesAll(userid, date2, callback) {
    let date = this.getDateIncome(date2);
    let income = 0;
    this.getIncomesByUser(userid, date).get().then((docRef) => {
      if (docRef.size == 1) {
        this.getTypeByIncomes(userid, docRef.docs[0].id).get().then((docRefIncomes) => {
          if (docRefIncomes.size == 1) {
            let incomeType = docRefIncomes.docs[0].data()
            income = incomeType.shop + incomeType.pet + incomeType.travel + incomeType.other + incomeType.food + incomeType.expenses
            this.getExpensesByUser(userid, date).get().then((docRefExp) => {
              if (docRefExp.size == 1) {
                this.getTypeAllByExpenses(userid, docRefExp.docs[0].id).get().then((docAllTypeExpenses) => {
                  if (docAllTypeExpenses.size > 0) {
                    let c = 0;
                    let expenses = 0;
                    docAllTypeExpenses.forEach(type => {
                      this.getDetailByExpenses(userid, docRefExp.docs[0].id, type.id).get().then((docDetail) => {
                        c += 1;
                        docDetail.forEach(doc => {
                          expenses += doc.data().money
                        })
                        if (c == docAllTypeExpenses.size) {
                          return callback(income, expenses);
                        }
                      })
                    })
                  } else {
                    return callback(income, 0);
                  }
                })
              } else {
                return callback(income, 0);
              }
            })
          } else {
            return callback(income, 0);
          }
        })
      } else {
        return callback(income, 0);
      }
    })
  }

  typeIncome(type, data) {
    switch (type) {
      case 'shopping': return data.shop
      case 'travel': return data.travel
      case 'pet': return data.pet
      case 'other': return data.other
      case 'food': return data.food
      case 'expenses': return data.expenses
    }
  }

  deleteDetail(date, type, id, userId) {
    let d = this.getDateIncome(date)
    return this.getExpensesByUser(userId, d).get().then((docEx) => {
      this.getTypeByExpenses(userId, docEx.docs[0].id, type).get().then((docType) => {
        firebase.firestore().collection('users/' + userId + '/expenses/' + docEx.docs[0].id + '/types/' + docType.docs[0].id + '/details').doc(id).delete()
      })
    })
  }

  async getIncomeYear(userId, date, callback) {
    let d = new Date(date)
    let income = 0;
    let expenses = 0;
    let doc = await firebase.firestore().collection('users/' + userId + '/incomes').where("date", '>=', d.getFullYear().toString()).orderBy('date').get()

    if (doc.size > 0) {
      doc.docs.forEach(async (date, i) => {
        console.log(i);
        if (date.data().date.split('-')[0] == d.getFullYear().toString()) {
          let docType = await this.getTypeByIncomes(userId, date.id).get()
          if (docType.size > 0) {
            // console.log(docType.docs[0].data());
            docType.forEach((type) => {
              let t = type.data()
              income += (t.expenses + t.food + t.other + t.pet + t.shop + t.travel)
            })

          }
        } else {
          return callback(income, expenses)
        }
      })

    } else {
      return callback(income, expenses)
    }

    let Exdoc = await firebase.firestore().collection('users/' + userId + '/expenses').where('date', '>=', d.getFullYear().toString()).orderBy('date').get()
    if (Exdoc.size > 0) {

      Exdoc.docs.forEach(async (date, k) => {
        console.log(k);
        if (date.data().date.split('-')[0] == d.getFullYear().toString()) {
          let typeExDoc = await this.getTypeAllByExpenses(userId, date.id).get()
          if (typeExDoc.size > 0) {
            typeExDoc.docs.forEach(async (typeEx, j) => {
              console.log(j);

              let detailExDoc = await this.getDetailByExpenses(userId, date.id, typeEx.id).get()
              console.log(detailExDoc.size);

              if (detailExDoc.size > 0) {
                detailExDoc.docs.forEach((detailEx, o) => {
                  console.log(detailEx.data());

                  let detail = detailEx.data();
                  expenses += detail.money;
                })

                if (j + 1 == typeExDoc.size && k + 1 == Exdoc.size) {
                  return callback(income, expenses)
                }
              } else {
                return callback(income, expenses)
              }

            })


          } else {
            return callback(income, expenses)
          }
        } else {
          return callback(income, expenses)
        }

      })
    } else {
      return callback(income, expenses)
    }

  }

  async arrYear(userId, date, callback) {
    let d = new Date(date)
    let income = [];
    let expenses = [];
    let label = []
    console.log(d.getFullYear().toString());

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    let doc = await firebase.firestore().collection('users/' + userId + '/incomes').where('date', '>=', d.getFullYear().toString()).orderBy('date').get()
    console.log(doc.size);

    if (doc.size > 0) {
      doc.docs.forEach(async (date, i) => {
        console.log(date.data());

        if (date.data().date.split('-')[0] == d.getFullYear().toString()) {
          label.push(monthNames[date.data().date.split('-')[1] - 1])
          let inc = 0;
          income[i] = 0;
          let docType = await this.getTypeByIncomes(userId, date.id).get()
          if (docType.size > 0) {
            // console.log(docType.docs[0].data());
            docType.forEach((type) => {
              let t = type.data()
              income[i] = (t.expenses + t.food + t.other + t.pet + t.shop + t.travel)
            })
            // income.push(inc)
          } else {
            return callback(income, expenses, label)
          }
        } else {
          return callback(income, expenses, label)
        }

        let Exdoc = await firebase.firestore().collection('users/' + userId + '/expenses').where('date', '==', date.data().date).get()
        if (Exdoc.size > 0) {

          Exdoc.docs.forEach(async (date, k) => {
            // if (date.data().date.split('-')[0] == d.getFullYear().toString()) {
            console.log(k);
            let ex = 0;
            expenses[i] = 0;
            let typeExDoc = await this.getTypeAllByExpenses(userId, date.id).get()
            if (typeExDoc.size > 0) {
              typeExDoc.docs.forEach(async (typeEx, j) => {
                console.log(j);

                let detailExDoc = await this.getDetailByExpenses(userId, date.id, typeEx.id).get()
                console.log(detailExDoc.size);

                if (detailExDoc.size > 0) {
                  detailExDoc.docs.forEach((detailEx, o) => {
                    console.log(detailEx.data());

                    let detail = detailEx.data();
                    // ex += detail.money;
                    expenses[i] += detail.money;
                  })

                  if (j + 1 == typeExDoc.size && k + 1 == Exdoc.size) {
                    return callback(income, expenses, label)
                  }
                } else {
                  return callback(income, expenses, label)
                }
              })
            } else {
              return callback(income, expenses, label)
            }
            // } else {
            //   return callback(income, expenses, label)
            // }
          })
        } else {
          return callback(income, expenses, label)
        }

      })
    } else {
      return callback(income, expenses, label)
    }

  }

  checkIncomeAgo(userid, date) {
    return firebase.firestore().collection('users/' + userid + '/incomes').where('date', '==', date)
  }


}
