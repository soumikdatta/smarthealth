import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';

import { ProfilePage } from '../profile/profile';
import { MymapPage } from '../mymap/mymap';
import { TabsPage } from '../tabs/tabs';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-mymenu',
  templateUrl: 'mymenu.html'
})
export class MymenuPage {

  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;
  
  tab1Root = MymapPage;
  tab2Root = ProfilePage;
  tab3Root = TabsPage;
  tab4Root = SettingsPage;

  constructor(public navCtrl: NavController, public storage:Storage) {
   
  }

  ionViewDidEnter(){

  }

  ionViewDidLeave(){
  }

  changeIcon(tab)
  {
    //console.log(tab);
  /*  this.tab1.tabTitle = "Current";
    this.tab2.tabTitle = "Previous";
    tab.tabTitle = "Changed";
    tab.color = "red";
  */
  }

  logout()
  {
    this.storage.clear();      
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_login);
    this.navCtrl.push(LoginPage);
  }


}
