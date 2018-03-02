import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
//import { RegisterPage } from '../register/register';
//import { LoginPage } from '../login/login';
import { EditprofilePage } from '../editprofile/editprofile';
import { ChangepicPage } from '../changepic/changepic';
import { MymapPage } from '../mymap/mymap';
//import { BookingPage } from '../booking/booking';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild('PIMG') PIMG;

  private rootPage;
  private profilePage;
  private editprofilePage;
  private changepicPage;
  private searchPage;
  private bookingPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.rootPage = ProfilePage;

    this.profilePage = ProfilePage;
    this.editprofilePage = EditprofilePage;
    this.changepicPage = ChangepicPage;
    this.searchPage = MymapPage;
    //this.bookingPage = BookingPage;
    this.bookingPage = TabsPage;

  }

  ionViewDidEnter()
  {
    this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
      if(result != null){
//          let jsonData:string=JSON.stringify(result);
        let myData = JSON.parse(result);
       console.log("Menu Stored Data:",myData);
        if(myData)
        {
          console.log("Menu Patient Photo",myData.records[0].patient_photo);
//                console.log(GlobalVars.WORKING_SERVER);
          this.PIMG=GlobalVars.WORKING_SERVER.concat("profile_pic/").concat(myData.records[0].patient_photo);
//                this.PIMG.src=GlobalVars.WORKING_SERVER.concat("profile_pic/");
//                console.log(this.PIMG);
        }
//          this.PID.value=this.profileConfig.data;
      }else{
        console.log("No data in storage menu");
//        this.storage.clear();      
//        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
//        this.navCtrl.push(HomePage);
      }
    });
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

  getImage()
  {
    return this.PIMG;
  }

}
