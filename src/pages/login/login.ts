import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
//import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
//import { ProfilePage } from '../profile/profile';
import { MenuPage } from '../menu/menu';
import 'rxjs/Rx';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('submit') submit;
//  @ViewChild('LSTAT') LSTAT;

  public LSTAT:any;
  
  private loginForm : FormGroup=new FormGroup({controllername:new FormControl()});
  private loginAuthURL="";
  private getPatientURL="";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public loadingCtrl: LoadingController) 
  {
    this.loginForm = this.formBuilder.group({
      userId:['', Validators.compose([Validators.minLength(5), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      password:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
    });
  }

  ionViewDidEnter()
  {
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_profile)
        {
          console.log("Profile Flow through Menu");
          this.navCtrl.push(MenuPage);          
        }
        else
        {
          console.log("Logged Out");
        }
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  loginAuth(){
    
    this.loginAuthURL=GlobalVars.END_POINT_GET_LOGIN_AUTH + "?user_id=" + this.loginForm.value.userId.toUpperCase() + "&user_type=PATIENT";
    console.log(this.loginAuthURL);
/*    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
*/
    this.httpClient.get(this.loginAuthURL).map((res: Response) => res).subscribe(data => {
      
        let jsonData:string=JSON.stringify(data);
        console.log(jsonData);
//        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
          let myData = JSON.parse(jsonData);
          console.log("LoginAuth Response",myData.records[0].password);
//        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
//        this.navCtrl.push(ProfilePage);
    
      if(this.loginForm.value.password==myData.records[0].password)
      {
        console.log('Login Success');
  /*      let loader = this.loadingCtrl.create({
          content: "Please wait...",
        });
  */      
          //console.log('storage',val);
            this.getPatientURL = GlobalVars.END_POINT_GET_PATIENT_PROFILE.concat("?patient_id=".concat(myData.records[0].patient_id));
            console.log(this.getPatientURL);
            this.httpClient.get(this.getPatientURL).map((res: Response) => res).subscribe(data => {
            
              let jsonData:string=JSON.stringify(data);
              this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
              console.log("patientProfile",jsonData);
              this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
              console.log("Menu from Login");
              this.navCtrl.push(MenuPage);
            });
//      this.navCtrl.push(ProfilePage);
      }
      else
      {
        
        console.log('Login failed');
        this.LSTAT = "Wrong User ID / Password \n";
      }
    });
  }

  gotoRegister(){
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_register);
  
        this.navCtrl.push(RegisterPage);

    
  }

}
