import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HttpClient } from '@angular/common/http';
import * as GlobalVars from '../../helper/globalvars';
import { LoginPage } from '../login/login';
//import { booking_info_storage_key } from '../../helper/globalvars';

/**
 * Generated class for the BookingnowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-bookingnow',
  templateUrl: 'bookingnow.html',
})
export class BookingnowPage {

  map: any;
  public booking_model;
  public status = true;
  public bookingDetailsData = [];
  private patientID;
  @ViewChild("bookingList") bookingList;
  @ViewChild("bookingDetails") bookingDetails;
  private directionsDisplay;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  @ViewChild('myCard') myCard;
  private watch;
  private lat;
  private lon;
  private location:any;
  private options;
  @ViewChild("map") mapRef: ElementRef;

  constructor(public navCtrl: NavController, private storage:Storage, private geolocation:Geolocation, 
    private diagnostic: Diagnostic, public platform: Platform, private httpClient:HttpClient, 
    public navParams: NavParams) {
  }

  ionViewDidEnter() {
    //console.log('ionViewDidLoad BookingnowPage');
    this.status = true;
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        //console.log(val);
        if(val==GlobalVars.access_type_profile)
        {
          //console.log("Profile Loaded Again");
          this.storage.get(GlobalVars.patient_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
             //console.log("Stored Data constructor:",myData);
              if(myData)
              {
                //console.log("Patient Photo Constructor",myData.records[0].patient_id);
                this.patientID = myData.records[0].patient_id;
                this.getBooking();
              }
            }else{
              //console.log("No data in storage constructor");
            }
          });
        }
        else
        {
          //console.log("Logged Out");
          this.navCtrl.push(LoginPage);          
        }
      });
  }

  getBooking()
  {
    let bookingNowURL = GlobalVars.END_POINT_GET_BOOKING_NOW_DATA + "?patient_id=" + this.patientID;
    //console.log(bookingNowURL);
    this.httpClient.get(bookingNowURL).map((res: Response) => res).subscribe(data => {

      let jsonData:string=JSON.stringify(data);
      //console.log(jsonData);
        let myData = JSON.parse(jsonData);
        //console.log("LoginAuth Response",myData.message);
        if(myData.message == "Booking available")
        {
          this.booking_model = myData.records;
        }
        else{
          this.status = false;
        }
    });
  }

  showDetails(item)
  {
    //console.log(item);
    this.bookingDetailsData = item;
/*     let content = '<ion-item style="width:95%; border-color: rgb(250, 48, 81);">'
                    +'<h1>Booking ID: '+item.booking_id+'</h1>'
                    +'<p><b>'+item.facility_name+'</b></p>'
                    +'<p>'+item.facility_address+'</p>'
                    +'<p><b>Phone:</b> '+item.facility_phone+'</p>'
                    +'<p><b>Symptoms:</b> '+item.symptoms+'</p>'
                    +'<p><b>Booking for:</b> '+item.visit_date+'</p>'
                    +'<p><b>Timing:</b> '+item.chamber_start+' to '+item.chamber_end+'</p>'
                    +'<p><b>No. of Patients:</b> '+item.no_patient+'</p>'
                    +'<p><b>Patient #: '+item.queue_status+'</b></p>'
//                    +'<button ion-button block style="width:95%; height:40px; color:white; background-color:red;" type="button" (click)="cancelBooking('+item.booking_id+')">Cancel</button>'
                    +'</ion-item>';
 */    //this.bookingDetails.nativeElement.innerHTML = content;
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

  cancelBooking(booking_id)
  {
    //console.log(booking_id);
    var confirmation = confirm("Are you sure you want to cancel booking?");
    console.log(confirmation);
    if(confirmation)
    {
      let bookingCancelURL = GlobalVars.END_POINT_SEND_CANCEL_BOOKING + "?booking_id=" + booking_id;
      //console.log(bookingCancelURL);
      this.httpClient.get(bookingCancelURL).map((res: Response) => res).subscribe(data => {

        let jsonData:string=JSON.stringify(data);
        //console.log(jsonData);
          let myData = JSON.parse(jsonData);
          //console.log("LoginAuth Response",myData.message);
          alert(myData.message);
          this.getBooking();
          this.hideDetails();
      });
    }
  }

  showMap(item)
  {
    this.platform.ready().then((readySource) => {

      this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
      //console.log('Is available? ' + isAvailable);
      //alert('Is available? ' + isAvailable);
      if(isAvailable)
      {

//      Location Lat & Long
//      const location = new google.maps.LatLng(22.5687, 88.4316);
//      this.watch = this.geolocation.watchPosition();
        this.watch = this.geolocation.getCurrentPosition();
        this.watch.then(pos => {
          //console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          this.location = new google.maps.LatLng(this.lat, this.lon);
          //console.log("Marker LatLng",this.location);
          // Map Options
          this.options = {
            center: this.location,
            zoom: 12,
            streetViewControl: false
          }

          this.map = new google.maps.Map(this.mapRef.nativeElement, this.options);
          this.bookingList.nativeElement.style.display = "none";
          this.bookingDetails.nativeElement.style.display = "none";
          this.mapRef.nativeElement.style.display = "block";
          this.startNavigating(item);

        });

      }
      else
      {
        //console.log("Location not activated");
        let act = confirm("Please turn on GPS.\nClose this once done.");
        if(act == true)
          this.showMap(item);
      }
      }).catch( (e) => {
      //console.log(e);
      alert(JSON.stringify(e));
      });
    });

  }

  startNavigating(item){
 
    //this.showMap();
    console.log(item);
    console.log("Lat:"+this.lat+" Lon:"+this.lon);
    console.log(item.facility_lat + ": " + item.facility_lng);
    let directionsService = new google.maps.DirectionsService;
    //let directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
        origin: new google.maps.LatLng(this.lat, this.lon),
        destination: new google.maps.LatLng(item.facility_lat,item.facility_lng),
        travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

        console.log("Directions Service Status",status);
        if(status == google.maps.DirectionsStatus.OK){
            this.directionsDisplay.setDirections(res);
            this.mapRef.nativeElement.style.height = "100%";
            //this.mylist.nativeElement.style.display = "none";
            //document.getElementById("facilityList").style.display = "none";
            this.myCard.nativeElement.style.display = "block";
            //this.directionsPanel.nativeElement.style.display = "block";
        } else {
            console.warn(status);
        }

    });

  }

  closeCard()
  {
    this.directionsDisplay.setMap(null);
    this.myCard.nativeElement.style.display = "none";
    this.directionsPanel.nativeElement.style.display = "none";
    this.mapRef.nativeElement.style.display = "none";
    //this.mylist.nativeElement.style.display = "block";
    this.bookingList.nativeElement.style.display = "block";

    this.directionsPanel.nativeElement.innerHTML = "";
  }


}
