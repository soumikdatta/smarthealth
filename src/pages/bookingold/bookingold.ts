import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HttpClient } from '@angular/common/http';
import * as GlobalVars from '../../helper/globalvars';
import { LoginPage } from '../login/login';

/**
 * Generated class for the BookingoldPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookingold',
  templateUrl: 'bookingold.html',
})
export class BookingoldPage {

  public booking_model;
  public status = true;
  @ViewChild("bookingList") bookingList;
  @ViewChild("bookingDetails") bookingDetails;

  constructor(public navCtrl: NavController, private storage:Storage, 
    private httpClient:HttpClient, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingnowPage');
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
                console.log("Patient Photo Constructor",myData.records[0].patient_id);
                let bookingNowURL = GlobalVars.END_POINT_GET_BOOKING_OLD_DATA + "?patient_id=" + myData.records[0].patient_id;
                console.log(bookingNowURL);
                this.httpClient.get(bookingNowURL).map((res: Response) => res).subscribe(data => {
      
                  let jsonData:string=JSON.stringify(data);
                  console.log(jsonData);
                    let myData = JSON.parse(jsonData);
                    console.log("LoginAuth Response",myData.message);
                    if(myData.message == "Booking available")
                    {
                      this.booking_model = myData.records;
                    }
                    else{
                      this.status = false;
                    }
                });
              }
            }else{
              console.log("No data in storage constructor");
            }
          });
        }
        else
        {
          console.log("Logged Out");
          this.navCtrl.push(LoginPage);          
        }
      });
  }

  showDetails(item)
  {
    console.log(item);
    let content = '<ion-item style="width:95%; border-color: rgb(250, 48, 81);">'
                    +'<h1>Booking ID: '+item.booking_id+'</h1>'
                    +'<p><b>'+item.facility_name+'</b></p>'
                    +'<p>'+item.facility_address+'</p>'
                    +'<p><b>Phone:</b> '+item.facility_phone+'</p>'
                    +'<p><b>Symptoms:</b> '+item.symptoms+'</p>'
                    +'<p><b>Booking for:</b> '+item.visit_date+'</p>'
                    +'<p><b>Timing:</b> '+item.chamber_start+' to '+item.chamber_end+'</p>'
                    +'</ion-item>';
    this.bookingDetails.nativeElement.innerHTML = content;
    //console.log(this.bookingList.nativeElement);
    this.bookingList.nativeElement.style.display = "none";
    //this.bookingList.style.display = "none";
    this.bookingDetails.nativeElement.style.display = "block";
  }

  hideDetails()
  {
    this.bookingDetails.nativeElement.style.display = "none";
    this.bookingList.nativeElement.style.display = "block";
  }

}
