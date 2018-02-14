/*import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
*/
import { Component,ViewChild, ElementRef } from '@angular/core';
import { Content, IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
//import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import { concat } from 'rxjs/observable/concat';

/**
 * Generated class for the MymapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-mymap',
  templateUrl: 'mymap.html',
})
export class MymapPage {
  
  @ViewChild("map") mapRef: ElementRef;
  @ViewChild(Content) content: Content;
  map: any;
  list: any;
  private watch;
  private lat:number=0;
  private lon:number=0;
  private location:any;
  private distance_value:number=1;
  public edited = false;
  public FACILITY_NAME: any;
  public facility: any;
  private options;

  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, 
    private storage: Storage, private geolocation:Geolocation, private httpClient:HttpClient) {
/*    platform.ready().then(() => {
      this.showMap();
    })
*/  }

  ionViewDidLoad() {
    //console.log(this.mapRef);
    //this.showMap();
    //this.loadMap();
    
    console.log("ionViewDidEnter");
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
        console.log(val);
        this.map = new google.maps.Map(this.mapRef.nativeElement, this.options);
        if(val==GlobalVars.access_type_profile)
        {
          console.log(val);
          this.showMap();
        }
      });
  }

  ionViewDidEnter(){
/*     console.log("ionViewDidEnter");
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_profile)
        {
          console.log(val);
          //this.geolocation.clearWatch();
          this.showMap();
        }
      });
 */  }

  showMap()
  {
    // Location Lat & Long
//    const location = new google.maps.LatLng(22.5687, 88.4316);
    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe(pos => {
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

      this.addMarker(this.location, this.map);

      this.renderMap();

    });

  }

  renderMap()
  {
    console.log("Current Range:"+this.distance_value+" KM");
/* 
    let inputAddress1 = "40, 40, GN Block, Sector V, Salt Lake City, Kolkata, West Bengal 700091";
    let inputAddress2 = "31/1L Beadon Row, Kolkata 700006";
    let inputAddress3 = "College More, Sector V, Salt Lake City, Kolkata, West Bengal 700091";
    let inputAddress4 = "35, 35, GN Block, Sector V, Salt Lake City, Kolkata, West Bengal 700091";
    let inputAddress5 = "30, 30, GN Block, Sector V, Salt Lake City, Kolkata, West Bengal 700091";

    this.getDoctor(inputAddress1,this.map);
    this.getDoctor(inputAddress2,this.map);
    this.getDoctor(inputAddress3,this.map);
    this.getDoctor(inputAddress4,this.map);
    this.getDoctor(inputAddress5,this.map);
*/      //this.showDoctor(docLoc.lat(),docLoc.ln());

    let getDoctorURL = GlobalVars.END_POINT_GET_DOCTOR_SEARCH + '?lat=' + this.lat + '&lng=' + this.lon + '&distance='+this.distance_value;
    this.httpClient.get(getDoctorURL).map((res: Response) => res).subscribe(data => {
    
      let jsonData:string=JSON.stringify(data);
      //console.log(jsonData);
      let myData = JSON.parse(jsonData);
      this.facility = myData.records;
      console.log(myData.records);
      //console.log(jsonData.length);
//      console.log("Search Response",myData.records[0].facility_address);
      var i=0;
      if(myData.records.length>0)
      {
        this.mapRef.nativeElement.style.height = "50%";
        this.edited=true;
        for(i=0;i<myData.records.length;i++)
        {
          let inputAddress = myData.records[i].facility_address;
          var contentString = '<script language="javascript">'+
          'function gotoBookingJS(){'+
          'console.log("In javascript function");'+
          '}'+
          '</script>'+
          '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">'+myData.records[i].facility_name+'</h1>'+
          '<div id="bodyContent">'+
          '<p><b>Address:</b> ' +
          myData.records[i].facility_address +
          '<br><b>Phone:</b> '+
          myData.records[i].facility_phone +
          '<br><b>Timing:</b> '+
          myData.records[i].chamber_start + "-" + myData.records[i].chamber_end +
          '<br><b>No. of Patients:</b> '+
          myData.records[i].no_patient +
          '</p>'+
          '<button type="button" block id="tap" (click)="gotoBooking()">Book Appointment</button>'+
          '</div>'+
          '</div>';
          this.getFacility(inputAddress,this.map,contentString,myData.records[i]);
        }
      }
    });
  }

  getDoctor(inputAddress,map)
  {
    var geocoder = new google.maps.Geocoder();
    var doctorLat;
    var doctorLng;
    var doctorLocation;
    geocoder.geocode({
        "address": inputAddress
    }, function(results) {
          //console.log("Home Location:"+results[0].geometry.location); //LatLng
          doctorLat = results[0].geometry.location.lat();
          doctorLng = results[0].geometry.location.lng();
          doctorLocation = results[0].geometry.location;
          const location = new google.maps.LatLng(doctorLat, doctorLng);
        //  console.log(doctorLocation);
          //console.log(location);
          var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">Doctor Location</h1>'+
          '<div id="bodyContent">'+
          '<p><b>Doctor Location</b>, is the location of the clinic. ' +
/*           'When the patient opens the map with GPS enabled, '+
          'he is able to see his own location on the map '+
          'along with the locations of all doctors and clinics with in 5 KM radious.</p>'+
 */          '</div>'+
          '</div>';
      
          //console.log("Doctor Marker at "+doctorLocation);
      
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
      
          var marker = new google.maps.Marker({
            position: location,
            map,
            title: 'Doctor Location'
          });
          return marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
          //return doctorLocation;
//        return doctorLocation = new google.maps.LatLng(doctorLat, doctorLng);
/*        console.log("Address LatLng:"+doctorLocation);
        this.showDoctor(doctorLat,doctorLng);
        //this.addMarker(doctorLocation, this.map);
*/    });
      //console.log("Doctor Location After " + doctorLocation);
    //this.addMarker(doctorLocation, this.map);

  }

  getFacility(inputAddress,map,contentString,myData)
  {
    //this.edited = false;
    var geocoder = new google.maps.Geocoder();
    var doctorLat;
    var doctorLng;
    var doctorLocation;
    geocoder.geocode({
        "address": inputAddress
    }, function(results) {
        //  console.log("Home Location:"+results[0].geometry.location); //LatLng
          doctorLat = results[0].geometry.location.lat();
          doctorLng = results[0].geometry.location.lng();
          doctorLocation = results[0].geometry.location;
          const location = new google.maps.LatLng(doctorLat, doctorLng);
        //  console.log(doctorLocation);
        //  console.log(location);
      
        //  console.log(inputAddress+" Marker at "+doctorLocation);
      
          var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
          });
      
          var marker = new google.maps.Marker({
            position: location,
            map,
            title: 'Doctor Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
          google.maps.event.addListener(infowindow, 'domready', function() {
            var clickableItem = document.getElementById('tap');
            clickableItem.addEventListener('click', function() {
            console.log("Going to booking");
            var func = function(){
              return true;
            }
            });
          });
          let func:Function;
          this.edited = func;
          //console.log(this.edited);
/*
            this.list.innerHTML = this.list.innerHTML + 
            "<ion-item style='background:purple;'>" + 
            "<div style='width:80%'>" + 
            "<b>" + myData.facility_name + "</b>" + 
            "<br>" + 
            myData.facility_address + 
            "<br>" + 
            "<b>Phone:</b> " + myData.facility_phone + 
            "<br>" + 
            "<b>Timing:</b> " + myData.chamber_start + " to " + myData.chamber_end + 
            "<br>" + 
            "<b>No. of Patients:</b> " + myData.no_patient + 
            "</div><div style='width:20%'>" + 
            '<button ion-button block type="button" (click)="gotoBooking()">Booking</button>' + 
            "</div>" + 
            "</ion-item>";
*/
            return marker.addListener('click', function() {
            //this.edited = true;
            this.FACILITY_NAME = myData.facility_name;
            console.log("this.edited=" + this.edited);
            infowindow.open(map, marker);
          });
    });
  }

  showDoctor(latitude,longitude)
  {
    const location = new google.maps.LatLng(latitude, longitude);
    this.addMarker(location, this.map);
  }

  addMarker(position, map){
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">My Location</h1>'+
    '<div id="bodyContent">'+
    '<p><b>My Location</b>, is the current GPS location of the patient. ' +
    'When the patient opens the map with GPS enabled, '+
    'he is able to see his own location on the map '+
    'along with the locations of all doctors and clinics with in 5 KM radious.</p>'+
    '</div>'+
    '</div>';

    //console.log("GPS Marker at "+position);

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });

    var marker = new google.maps.Marker({
      position,
      map,
      title: 'My Location'
    });
    return marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
 
  }

  changeDistance(val: any)
  {
    console.log("Distance: ",val);
    this.distance_value = val;
    this.renderMap();
  }

  gotoBooking(item)
  {
    console.log("Initiate Booking");
    console.log(item.facility_name);
  }

/*

  loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

//    this.map = this.googleMaps.create('map_canvas', mapOptions);
    this.map = GoogleMaps.create('map', mapOptions);
    
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }
*/
}
