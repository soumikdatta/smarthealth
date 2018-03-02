import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BookingnowPage } from '../bookingnow/bookingnow';
import { BookingoldPage } from '../bookingold/bookingold';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BookingnowPage;
  tab2Root = BookingoldPage;
  tab3Root = HomePage;

  constructor(public navCtrl: NavController, public storage:Storage) {
   
  }

  ionViewDidEnter(){

  }

  ionViewDidLeave(){
  }

}
