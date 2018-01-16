import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import {HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
//import { ProfilePage } from '../profile/profile';
import { ProfileConfig } from '../../helper/ProfileConfig';
import 'rxjs/Rx';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private registrationForm : FormGroup=new FormGroup({controllername:new FormControl()});
//  private getPatientURL="";
  private profileConfig : ProfileConfig;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public loadingCtrl: LoadingController) 
  {
    this.registrationForm = this.formBuilder.group({
      userId:['', Validators.compose([Validators.minLength(5), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      name:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      address:['', Validators.compose([Validators.minLength(8), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*'), Validators.required])],
//      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('^[^\s]+\@[^\s]+\.[^\s]{2,}$'), Validators.required])],
      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\@ ]*'), Validators.required])],
      phone:['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9 ]*'), Validators.required])],
      password:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
/*    this.storage.get(GlobalVars.patient_profile_storage_key).then(val=>
      {
        console.log('storage',val);
        if(val===null){
          this.getPatientURL = GlobalVars.END_POINT_GET_PATIENT_PROFILE.concat("?patient_id=18011982");
//            console.log(this.getPatientURL);
          this.httpClient.get(this.getPatientURL).map((res: Response) => res).subscribe(data => {
          
            let jsonData:string=JSON.stringify(data);
            this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
            console.log("patientProfile",jsonData);
            this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
            this.navCtrl.push(ProfilePage);
          });
        }
    });
*/
}

  register()
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
      this.httpClient.post(GlobalVars.END_POINT_SEND_REGISTRATION_DATA, profileConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        console.log('Registration saved',data);
//        this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
        loader.dismiss();
        this.gotoMainPage();    
      },
        // Errors will call this callback instead:
        err => {
          loader.dismiss();
          console.log(profileConfigJson);
          console.log('Could not save Registration!',err);
        }
      );
      //console.log(JSON.stringify(this.ambulanceConfig));
//      this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
      //this.gotoMainPage();
    }
  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.profileConfig=new ProfileConfig();
    this.profileConfig.patient_name = this.registrationForm.value.name;
    this.profileConfig.patient_address = this.registrationForm.value.address;
    this.profileConfig.patient_email = this.registrationForm.value.email;
    this.profileConfig.patient_phone = this.registrationForm.value.phone;
    this.profileConfig.user_id = this.registrationForm.value.userId;
    this.profileConfig.password = this.registrationForm.value.password;
    
  }
  
  gotoMainPage(){
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_login);
    this.navCtrl.push(LoginPage);
  }

}
