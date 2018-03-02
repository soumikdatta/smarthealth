import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import * as GlobalVars from '../../helper/globalvars';
//import {HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
//import { ProfileConfigs } from '../../helper/ProfileConfigs';
//import { ProfileConfig } from '../../helper/ProfileConfig';
import { MenuPage } from '../menu/menu';
import { ProfileConfig } from '../../helper/ProfileConfig';
import 'rxjs/Rx';

/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {

  @ViewChild('PID') PID;
  @ViewChild('PNAME') PNAME;
  @ViewChild('PADD') PADD;
  @ViewChild('PEMAIL') PEMAIL;
  @ViewChild('PPH') PPH;
  @ViewChild('PIMG') PIMG;
  public PPHOTO: any;

  private editProfileForm : FormGroup=new FormGroup({controllername:new FormControl()});
//  private getPatientURL="";
  private profileConfig : ProfileConfig;
  
//  private profileConfigs : ProfileConfigs = new ProfileConfigs();

  constructor(public navCtrl: NavController, private storage:Storage, public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public navParams: NavParams) {
      this.editProfileForm = this.formBuilder.group({
        name:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
        address:['', Validators.compose([Validators.minLength(8), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*'), Validators.required])],
  //      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('^[^\s]+\@[^\s]+\.[^\s]{2,}$'), Validators.required])],
        email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\@ ]*'), Validators.required])],
        phone:['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9 ]*'), Validators.required])]
      });
  
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
				        this.PPHOTO = myData.records[0].patient_photo;
                this.PIMG=GlobalVars.WORKING_SERVER.concat("profile_pic/") + myData.records[0].patient_photo;
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

  saveProfile()
  {
    console.log('Registration Success');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    
      //console.log('saveconfig');
      this.populateConfigObject();
//      loader.present();

      let profileConfigJson:string = JSON.stringify(this.profileConfig);
      console.log("Sent Data:",profileConfigJson);
      let updURL = GlobalVars.END_POINT_SEND_PROFILE_DATA;
      console.log(updURL);
      this.httpClient.post(updURL, profileConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        console.log('Profile saved',data);
//        this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
        loader.dismiss();
        this.gotoMenuPage();    
      },
        // Errors will call this callback instead:
        err => {
          loader.dismiss();
          console.log(profileConfigJson);
          console.log('Could not save Profile!',err);
        }
      );
      //console.log(JSON.stringify(this.ambulanceConfig));
//      this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
      //this.gotoMainPage();
    }
  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.profileConfig=new ProfileConfig();
    this.profileConfig.patient_id = this.PID.value;
    this.profileConfig.patient_name = this.editProfileForm.value.name;
    this.profileConfig.patient_address = this.editProfileForm.value.address;
    this.profileConfig.patient_email = this.editProfileForm.value.email;
    this.profileConfig.patient_phone = this.editProfileForm.value.phone;
    this.profileConfig.patient_photo = this.PPHOTO;
//    this.profileConfig.user_id = this.editProfileForm.value.userId;
//    this.profileConfig.password = this.editProfileForm.value.password;
    console.log("Populated",this.profileConfig);
    
  }
  
  gotoMenuPage(){
    let getPatientURL="";
    this.storage.clear();
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
    getPatientURL = GlobalVars.END_POINT_GET_PATIENT_PROFILE + "?patient_id=" + this.PID.value;
    console.log(getPatientURL);
    this.httpClient.get(getPatientURL).map((res: Response) => res).subscribe(data => {
    
      let jsonData:string=JSON.stringify(data);
      this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
      console.log("patientProfile",jsonData);
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
      this.navCtrl.push(MenuPage);
    });
    this.navCtrl.push(MenuPage);
  }

}
