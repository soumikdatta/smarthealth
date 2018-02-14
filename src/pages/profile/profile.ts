import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
//import {HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
//import { ProfileConfigs } from '../../helper/ProfileConfigs';
//import { ProfileConfig } from '../../helper/ProfileConfig';
//import { MenuPage } from '../menu/menu';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  @ViewChild('PID') PID;
  @ViewChild('PNAME') PNAME;
  @ViewChild('PADD') PADD;
  @ViewChild('PEMAIL') PEMAIL;
  @ViewChild('PPH') PPH;
  @ViewChild('PIMG') PIMG;
  
//  private profileConfigs : ProfileConfigs = new ProfileConfigs();

  constructor(public navCtrl: NavController, private storage:Storage, 
    public navParams: NavParams) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
/*     this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
      if(result != null){
        let jsonData:string=JSON.stringify(result);
        let myData = JSON.parse(result);
       console.log("Stored Data ionViewDidLoad:",myData);
        if(myData)
        {
          console.log("Patient ID DidLoad",myData.records[0].patient_id);
          this.PID.value=myData.patient_id;
          this.PNAME.value=this.profileConfigs.patient_name;
          this.PADD.value=this.profileConfigs.patient_address;
          this.PEMAIL.value=this.profileConfigs.patient_email;
          this.PPH.value=this.profileConfigs.patient_phone;
      }
          this.PID.value=this.profileConfig.data;
      }else{
        console.log("No data in storage ionViewDidLoad");
        this.storage.clear();      
        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
        this.navCtrl.push(HomePage);
      }
    });
*/
}

  ionViewDidEnter()
  {
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_profile)
        {
          console.log("Profile Loaded Again");
          this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
             console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Patient Photo Constructor",myData.records[0].patient_photo);
                this.PID.value=myData.records[0].patient_id;
                this.PNAME.value=myData.records[0].patient_name;
                this.PADD.value=myData.records[0].patient_address;
                this.PEMAIL.value=myData.records[0].patient_email;
                this.PPH.value=myData.records[0].patient_phone;
//                console.log(GlobalVars.WORKING_SERVER);
                this.PIMG=GlobalVars.WORKING_SERVER.concat("profile_pic/").concat(myData.records[0].patient_photo);
//                this.PIMG.src=GlobalVars.WORKING_SERVER.concat("profile_pic/");
//                console.log(this.PIMG);
              }
    //          this.PID.value=this.profileConfig.data;
            }else{
              console.log("No data in storage constructor");
      //        this.storage.clear();      
      //        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
      //        this.navCtrl.push(HomePage);
            }
          });
//          this.navCtrl.push(MenuPage);
//          this.gotoProfile();
        }
        else
        {
          console.log("Logged Out");
          this.navCtrl.push(HomePage);          
        }
      });

/*     this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
      if(result != null){
        let jsonData:string=JSON.stringify(result);
        let myData = JSON.parse(result);
       console.log("Stored Data ionViewDidEnter:",myData);
        if(this.profileConfigs)
        {
          console.log("Patient ID DidEnter",myData.records[0].patient_id);
          this.PID.value=myData.patient_id;
          this.PNAME.value=this.profileConfigs.patient_name;
          this.PADD.value=this.profileConfigs.patient_address;
          this.PEMAIL.value=this.profileConfigs.patient_email;
          this.PPH.value=this.profileConfigs.patient_phone;
      }
          this.PID.value=this.profileConfig.data;
      }else{
        console.log("No data in storage ionViewDidEnter");
        this.storage.clear();      
        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
        this.navCtrl.push(HomePage);
      }
    }); */
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
