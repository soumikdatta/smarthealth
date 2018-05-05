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
import {FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import * as GlobalVars from '../../helper/globalvars';
//import { LoadingController } from 'ionic-angular';
import {HttpHeaders } from '@angular/common/http';
import {HttpClient } from '@angular/common/http';
import { BookinginitiatePage } from '../bookinginitiate/bookinginitiate';
import { FilterConfig } from '../../helper/FilterConfig';

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
  @ViewChild("filter") filter;
  //@ViewChild("facilityList") mylist;
  private mylist = document.getElementById("facilityList");
  @ViewChild("filterBtn") filterBtn;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  @ViewChild('myCard') myCard;
  @ViewChild('facilityBar') facilityBar;
  private directionsDisplay;
  map: any;
  list: any;
  private watch;
  private lat;
  private lon;
  private location:any;
  private distance_value:number=15;
  public edited = false;
  public showDoctor = false;
  public FACILITY_NAME: any;
  public facility: any;
  public doctorList = [];
  public facilitiesList = [];
  private options;
  private speciality;
  private markers = [];
  private myMarker = [];
  public server = GlobalVars.WORKING_SERVER.concat("profile_pic/");
  public locationList = ["KOLKATA"];
  private places;
  public searching = false;
  public dropIcon = "UP";

  private filterForm : FormGroup=new FormGroup({controllername:new FormControl()});

  private filterConfig : FilterConfig;

  constructor(public navCtrl: NavController, private diagnostic: Diagnostic, public platform: Platform, 
    public navParams: NavParams, private storage: Storage, private geolocation:Geolocation, 
    private formBuilder: FormBuilder, private httpClient:HttpClient) {

/*constructor(public navCtrl: NavController, public platform: Platform, 
  public navParams: NavParams, private storage: Storage, private geolocation:Geolocation, 
  private formBuilder: FormBuilder, private httpClient:HttpClient) {
*/   this.filterForm = this.formBuilder.group({
      speciality:[''],
      availability:[''],
      visit_date:[''],
      facility:[''],
      doctor:[''],
      location:['']
    });
/*    platform.ready().then(() => {
      this.showMap();
    })
*/  }

  ionViewDidLoad() {
      //console.log(this.mapRef);
      //this.populateConfigObject();
      this.showMap();
      //this.loadMap();  
  }

  showMap()
  {
    /* this.platform.ready().then((readySource) => {

      this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
      //console.log('Is available? ' + isAvailable);
      //alert('Is available? ' + isAvailable);
      if(isAvailable)
      { */

//      Location Lat & Long
//      const location = new google.maps.LatLng(22.5687, 88.4316);
//      this.watch = this.geolocation.watchPosition();
        this.watch = this.geolocation.getCurrentPosition();
        this.watch.then(pos => {
          //console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          this.location = new google.maps.LatLng(this.lat, this.lon);
          this.populateConfigObject();
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

          this.httpClient.get(GlobalVars.END_POINT_GET_ALL_SPECIALITIES).map((res: Response) => res).subscribe(data => {
            //console.log(data);
            this.speciality = data;
          });

          /* // Create the search box and link it to the UI element.
          var input = document.getElementById('pac-input');
          var searchBox = new google.maps.places.SearchBox(input);
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); */

          /* // Bias the SearchBox results towards current map's viewport.
          this.map.addListener('bounds_changed', function() {
            searchBox.setBounds(this.map.getBounds());
          });

          var markers = [];
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            console.log("place.geometry.location:",this.places[0].geometry.location.lat());
            document.getElementById("updLoc").style.display = "block";

            //this.myMarker.push(marker);
            if (places.length == 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }
              var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              // Create a marker for each place.
              markers.push(new google.maps.Marker({
                map: this.map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              }));

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            this.map.fitBounds(bounds);
          });
          //this.addMarker(this.places[0].geometry.location, this.map); */
        });

      /* }
      else
      {
        //console.log("Location not activated");
        let act = confirm("Please turn on GPS.\nClose this once done.");
        if(act == true)
          this.showMap();
      }
      }).catch( (e) => {
      //console.log(e);
      alert(JSON.stringify(e));
      });
    }); */

  }

  updateLocation()
  {
    console.log(this.places);
    var position = new google.maps.LatLng(this.places[0].geometry.location.lat(),this.places[0].geometry.location.lng());
    var map = this.map;
    var marker = new google.maps.Marker({
      position,
      map,
      title: 'Searched Location'
    });
    marker.setMap(map);
  }

  getSearch()
  {
    console.log("Getting search places");
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    this.places = searchBox.getPlaces();
    console.log("place.geometry.location:",searchBox.getPlaces());
    //console.log("Searched Place:",input.value);
    document.getElementById("updLoc").style.display = "block";
  }

  renderMap()
  {
    //console.log("Current Range:"+this.distance_value+" KM");
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

//      loader.present();

      let filterConfigJson:string = JSON.stringify(this.filterConfig);
      //console.log("Sent Data:",filterConfigJson);
      console.log("URL:",GlobalVars.END_POINT_GET_DOCTOR_SEARCH);
      this.httpClient.post(GlobalVars.END_POINT_GET_DOCTOR_SEARCH, filterConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe(data => {
    
      let myData = JSON.parse(data);
      //console.log(data);
      //console.log(myData);
      console.log(myData.records);
      console.log(myData.facilities);
//      console.log("Search Response",myData.records[0].facility_address);
      var i=0;
      if(myData.records.length>0)
      {
        this.facility = myData.records;
        this.facilitiesList = myData.facilities;
        console.log("this.facilitiesList",this.facilitiesList);
        this.facilityBar.nativeElement.style.display = "block";
        this.mapRef.nativeElement.style.height = "90%";
        //this.edited=true;
        for(i=0;i<myData.records.length;i++)
        {
          //let inputAddress = myData.records[i].facility_address;
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
          '</p>';
          //contentString += '<button type="button" block id="tap" (click)="gotoBooking()">Book Appointment</button>';
          contentString += '</div>'+
          '</div>';
          this.getFacility(myData.records[i].lat,myData.records[i].lng,this.map,contentString,myData.records[i]);
        }

        this.setMapOnAll(this.map);
      }
      else
      {
        console.log("this.mapRef",this.mapRef);
        this.mapRef.nativeElement.style.height = "100%";
        console.log("this.mylist",this.mylist);
        this.facilityBar.nativeElement.style.display = "none";
        //document.getElementById("facilityList").style.display = "none";
        this.edited = false;
      }
    });
  }

  showList()
  {
    if(this.edited || this.showDoctor)
    {
      this.mapRef.nativeElement.style.display = "block";
      this.edited = false;
      this.showDoctor = false;
      this.dropIcon = "UP";
    }
    else
    {
      this.mapRef.nativeElement.style.display = "none";
      this.edited = true;
      this.showDoctor = false;
      this.dropIcon = "DOWN";
    }
  }

  getDoctorList(facility_id)
  {
    this.doctorList = [];
    for(var i=0; i<this.facility.length; i++)
    {
      if(this.facility[i].facility_id == facility_id)
      {
        this.doctorList.push(this.facility[i]);
      }
    }
    //document.getElementById("facilityList").style.display = "none";
    //document.getElementById("doctorsList").style.display = "block";
    this.edited = false;
    this.showDoctor = true;
    this.dropIcon = "BACK";
    console.log(this.doctorList);
  }

  getFacilityList()
  {
    this.edited = true;
    this.showDoctor = false;
    this.dropIcon = "DOWN";
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

  getFacility(doctorLat, doctorLng,map,contentString,myData)
  {
    //this.edited = false;
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
      title: 'Facility Location',
      icon: 'http://139.59.20.250/images/marker_building.png'
      //icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
    google.maps.event.addListener(infowindow, 'domready', function() {
      var clickableItem = document.getElementById('tap');
      /* clickableItem.addEventListener('click', function() {
      //console.log("Going to booking");
      }); */
    });
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
    marker.addListener('click', function() {
      //this.edited = true;
      this.FACILITY_NAME = myData.facility_name;
      //console.log("this.edited=" + this.edited);
      infowindow.open(map, marker);
    });
    this.markers.push(marker);
  }

  /* showDoctor(latitude,longitude)
  {
    const location = new google.maps.LatLng(latitude, longitude);
    this.addMarker(location, this.map);
  } */

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
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

    marker.addListener('dragend', function(){
      console.log(marker.getPosition());
    });

    //this.setMapOnAll(this.myMarker);
    this.myMarker.push(marker);
    this.myMarker[0].setMap(map);
 
  }

  changeDistance(val: any)
  {
    //console.log("Distance: ",val);
    this.distance_value = val;
    this.renderMap();
  }

  gotoBooking(item)
  {
    //console.log("Initiate Booking");
    //console.log(item);
    this.storage.set(GlobalVars.booking_info_storage_key,item);
    //this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_booking);
    this.navCtrl.push(BookinginitiatePage);
  }

  showFilter()
  {
    console.log("Toggle Filter Div",this.filter.nativeElement.style.display);
    if(this.filter.nativeElement.style.display == "none")
    {
      this.filter.nativeElement.style.display = "block";
      this.mapRef.nativeElement.style.display = "none";
      //this.mylist.nativeElement.style.display = "none";
      //document.getElementById("facilityList").style.display = "none";
      this.edited = false;
      this.showDoctor = false;
      this.searching = false;
    }
    else
    {
      //console.log("Filter will be applied");
      this.filter.nativeElement.style.display = "none";
      //this.mapRef.nativeElement.style.display = "block";
      //this.mylist.nativeElement.style.display = "block";
      //document.getElementById("facilityList").style.display = "block";
      //this.filterSearch();
      this.edited = true;

    }
  }

  filterSearch()
  {
    //console.log("Filter will close");
    this.searching = true;
    this.showFilter();
    this.populateConfigObject();
    this.setMapOnAll(null);
    this.markers = [];
    this.renderMap();

  }

  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.filterConfig=new FilterConfig();
    this.filterConfig.lat = this.lat;
    this.filterConfig.lng = this.lon;
    this.filterConfig.speciality = this.filterForm.value.speciality;
    this.filterConfig.availability = this.filterForm.value.availability;
    this.filterConfig.visit_date = this.filterForm.value.visit_date;
    this.filterConfig.facility = this.filterForm.value.facility;
    this.filterConfig.doctor = this.filterForm.value.doctor;
    this.filterConfig.location = this.filterForm.value.location;
    this.filterConfig.distance = this.distance_value;
    console.log("Sent Data:",this.filterConfig);
    
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  resetGPS()
  {
    //console.log("Resetting GPS");
    this.myMarker[0].setMap(null);
    this.watch = this.geolocation.getCurrentPosition();
    this.watch.then(pos => {
      //console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.lat = pos.coords.latitude;
      this.lon = pos.coords.longitude;
      this.location = new google.maps.LatLng(this.lat, this.lon);
      this.map.panTo(this.location);
      this.map.setZoom(12);
      this.addMarker(this.location, this.map);
    });
  }

  startNavigating(item){
 
    let directionsService = new google.maps.DirectionsService;
    //let directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
        origin: new google.maps.LatLng(this.lat, this.lon),
        destination: new google.maps.LatLng(item.lat,item.lng),
        travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

        if(status == google.maps.DirectionsStatus.OK){
            this.directionsDisplay.setDirections(res);
            this.mapRef.nativeElement.style.height = "100%";
            //this.mylist.nativeElement.style.display = "none";
            document.getElementById("doctorsList").style.display = "none";
            this.myCard.nativeElement.style.display = "block";
            this.directionsPanel.nativeElement.style.display = "block";
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
    this.mapRef.nativeElement.style.height = "50%";
    //this.mylist.nativeElement.style.display = "block";
    document.getElementById("facilityList").style.display = "block";

    this.directionsPanel.nativeElement.innerHTML = "";
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
