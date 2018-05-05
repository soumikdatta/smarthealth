import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as GlobalVars from '../../helper/globalvars';
import {HttpHeaders } from '@angular/common/http';
import {HttpClient } from '@angular/common/http';

/**
 * Generated class for the TransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {

  public transactions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient:HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsPage');
    this.httpClient.get(GlobalVars.END_POINT_GET_TRANSACTIONS + "?user_id=" + "18011982").map((res: Response) => res).subscribe(data => {
      console.log(data);
      this.transactions = JSON.parse(JSON.stringify(data)).records;
    });
  }

}
