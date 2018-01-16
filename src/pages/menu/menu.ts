import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
//import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { EditprofilePage } from '../editprofile/editprofile';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  private rootPage;
  private profilePage;
  private imagePage;
  private loginPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.rootPage = ProfilePage;

    this.profilePage = ProfilePage;
    this.imagePage = EditprofilePage;
    this.loginPage = LoginPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Menu Page');
  }

  openPage(p) {
    this.rootPage = p;
  }

  logout()
  {
    this.storage.clear();      
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
    this.navCtrl.push(HomePage);
  }

}
