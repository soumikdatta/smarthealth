import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as GlobalVars from '../../helper/globalvars';
import { BookingConfig } from '../../helper/BookingConfig';
import { LoginPage } from '../login/login';

/**
 * Generated class for the BookinginitiatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookinginitiate',
  templateUrl: 'bookinginitiate.html',
})
export class BookinginitiatePage {

  public facility_name;
  public chamber_id;
  public facility_address;
  public facility_phone;
  public chamber_start;
  public chamber_end;
  public patient_id;
  public patient_name;
  public patient_address;
  public patient_phone;
  public patient_age;
  public sex;
  public status = false;
  public booking_id: any;
  public queue_status: any;

  private bookingForm : FormGroup=new FormGroup({controllername:new FormControl()});

  private bookingConfig : BookingConfig;

  constructor(public navCtrl: NavController, private storage:Storage, public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public navParams: NavParams) {
      this.bookingForm = this.formBuilder.group({
        chamber_id:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9 ]*')])],
        patient_id:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9 ]*')])],
        name:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
        address:['', Validators.compose([Validators.minLength(1), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9 \.\,\//\n/\r ]*'), Validators.required])],
        age:['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.pattern('[0-9]*'), Validators.required])],
        sex:['', Validators.compose([Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[mMfFoO]*'), Validators.required])],
        phone:['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9 ]*'), Validators.required])],
        symptoms:['', Validators.compose([Validators.maxLength(200), Validators.pattern('[a-zA-Z0-9\.\'\,\/ ]*')])]
      });
  
    }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad BookinginitiatePage');
  }

  ionViewDidEnter()
  {
    this.storage.get(GlobalVars.access_type_key).then(val=>
    {
      
      //console.log(val);
      if(val==GlobalVars.access_type_profile)
      {
        //console.log("Profile Loaded Again");
        this.storage.get(GlobalVars.booking_info_storage_key).then(result=>{
          //console.log(result);
          if(result != null){
  //          let jsonData:string=JSON.stringify(result);
            //let myData = JSON.parse(result);
            let myData = result;
            //console.log("Stored Data constructor:",myData);
            if(myData)
            {
              //console.log("Patient Photo Constructor",myData.facility_name);
              this.chamber_id=myData.chamber_id;
              this.facility_name=myData.facility_name;
              this.facility_address=myData.facility_address;
              this.facility_phone=myData.facility_phone;
              this.chamber_start=myData.chamber_start;
              this.chamber_end=myData.chamber_end;
            }
          }else{
            //console.log("No data in storage constructor");
    //        this.storage.clear();      
    //        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
    //        this.navCtrl.push(HomePage);
          }
          this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
            //console.log(result);
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              //let myData = JSON.parse(result);
              let myData = JSON.parse(result).records[0];
              //console.log("Stored Data constructor:",myData);
              if(myData)
              {
                //console.log("Patient Photo Constructor",myData.facility_name);
                this.patient_id=myData.patient_id;
                this.patient_name=myData.patient_name;
                this.patient_address=myData.patient_address;
                this.patient_phone=myData.patient_phone;
              }
            }else{
              //console.log("No data in storage constructor");
      //        this.storage.clear();      
      //        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
      //        this.navCtrl.push(LoginPage);
            }
        });
      });
//          this.navCtrl.push(MenuPage);
//          this.gotoProfile();
      }
      else
      {
        //console.log("Logged Out");
        this.navCtrl.push(LoginPage);          
      }
    });
  }

  saveBooking(){
    //console.log('Registration Success');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    
      //console.log('saveconfig');
      this.populateConfigObject();
//      loader.present();

      let bookingConfigJson:string = JSON.stringify(this.bookingConfig);
      //console.log("Sent Data:",bookingConfigJson);
      let updURL = GlobalVars.END_POINT_SEND_BOOKING_DATA;
      //console.log(updURL);
      this.httpClient.post(updURL, bookingConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        //console.log('Booking saved',data);
//        this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
        loader.dismiss();
        //let jsonData:string=JSON.stringify(data);
        //console.log(jsonData);
        let myData = JSON.parse(data);
        //console.log(myData);
        this.booking_id = myData.booking_id;
        this.queue_status = myData.queue_status;
        this.status = true;
//        this.gotoMenuPage();    
      },
        // Errors will call this callback instead:
        err => {
          loader.dismiss();
          //console.log(bookingConfigJson);
          //console.log('Could not save Profile!',err);
        }
      );
      //console.log(JSON.stringify(this.ambulanceConfig));
//      this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
      //this.gotoMainPage();
  }
  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.bookingConfig=new BookingConfig();
    this.bookingConfig.patient_id = this.patient_id;
    this.bookingConfig.patient_name = this.bookingForm.value.name;
    this.bookingConfig.patient_address = this.bookingForm.value.address;
    this.bookingConfig.patient_age = this.bookingForm.value.age;
    this.bookingConfig.patient_phone = this.bookingForm.value.phone;
    this.bookingConfig.patient_sex = this.bookingForm.value.sex.toUpperCase();
    this.bookingConfig.chamber_id = this.chamber_id;
    this.bookingConfig.symptoms = this.bookingForm.value.symptoms;
//    this.profileConfig.password = this.editProfileForm.value.password;
    //console.log("Populated",this.bookingConfig);
    
  }

  gotoMenuPage(){
/*    let getPatientURL="";
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
*/  }

}
