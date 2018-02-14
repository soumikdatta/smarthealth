import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
//import { ProfilePage } from '../profile/profile';
import { EditprofilePage } from '../editprofile/editprofile';
import { MenuPage } from '../menu/menu';
import { MymapPage } from '../mymap/mymap';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private storage:Storage,
    private httpClient:HttpClient,public loadingCtrl: LoadingController) {

      storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_login)
        {
          console.log("Login Flow");
          this.gotoLogin();
        }
        else if(val==GlobalVars.access_type_register)
        {
          console.log("Sign Up Flow");
          this.gotoRegister();
        }
        else if(val==GlobalVars.access_type_profile)
        {
          console.log("Profile Flow through Menu");
          this.gotoProfile();
        }
        else if(val==GlobalVars.access_type_map)
        {
          console.log("Map Page");
          this.gotoMap();
        }
      });
      
    }


    gotoLogin(){
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_login);
      
          this.navCtrl.push(LoginPage);
    
      
    }
    gotoRegister(){
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_register);
    
          this.navCtrl.push(RegisterPage);
  
      
    }
    gotoProfile(){
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
    
/*      let loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
*/      
        this.storage.get(GlobalVars.patient_profile_storage_key).then(val=>
        {
          //console.log('storage',val);
          if(val==null){
            this.httpClient.get(GlobalVars.END_POINT_GET_PATIENT_PROFILE).map((res: Response) => res).subscribe(data => {
            
              let jsonData:string=JSON.stringify(data);
              this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
              console.log("patientProfile",jsonData);
            });
            this.navCtrl.push(MenuPage);
          }else{
          this.navCtrl.push(MenuPage);
          }
      });
    }
    gotoEditProfile(){
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
    
          this.navCtrl.push(EditprofilePage);
  
      
    }
    gotoMap(){
      this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_map);
    
          this.navCtrl.push(MymapPage);
  
      
    }
  }
