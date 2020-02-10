import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { IconSequence } from '@agm/core/services/google-maps-types';
import { DashboardService } from '../../dashboard.service';
import {  MapsAPILoader,MarkerManager,GoogleMapsAPIWrapper } from '@agm/core';

export interface myinterface {
  removeMap(index: number);
}

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  providers: [MarkerManager,GoogleMapsAPIWrapper]
})
export class GoogleMapComponent implements OnInit {
  @Input() markers:any;
  @Input() companyId:any;
  @Input() markers_link:any;
  @Output() boxDetails: any = new EventEmitter();
  @Input() Latitude:any;
  @Input() Longitude:any;
  @Input() zoom:any;
  @Input() isDragabble: boolean;
  @Output() markerAddress: any = new EventEmitter();

  //markers_test:any;
animation = "'BOUNCE'";//"marker.label == 'UP'?'BOUNCE':'DROP'";
userLocationMarkerAnimation:any;
polyline1:any;
markerPins:any;
icons:any;
selectedMarker: any;
private geoCoder;
address: any;
Location: any;
index:any;
//interface for Parent-Child interaction
public compInteraction: myinterface;
public selfRef: GoogleMapComponent;
polyOptions:IconSequence = {
  icon: {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
  },
  offset: '0',
  repeat: '20px'
 }
  
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private apiService: DashboardService,
    private markerManager:MarkerManager 
    ) { }

  ngOnInit() {
    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4
    };

    // Create the polyline, passing the symbol in the 'icons' property.
    // Give the line an opacity of 0.
    // Repeat the symbol at intervals of 20 pixels to create the dashed effect.
   
      this.icons= [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }];
      this.mapsAPILoader.load().then(() => {
        console.log("----------------mapsAPILoader called---------");
        this.geoCoder = new google.maps.Geocoder;
      });
  }

  mapReading() {
    this.userLocationMarkerAnimation = 'BOUNCE';
  }
  //Latitude = 19.0145;
  //Longitude = 73.0414;
 
  
  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType]));
  }

  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType]));
  }

  selectMarker(event, val) {
    console.log('-----------'+JSON.stringify(val) + typeof event);
    let modalid = val.modelid;
    let macId: any = { Id: modalid }
    if(val) {
      this.boxDetails.emit(macId);      
      // for(var i = 0 ; i < this.markers.length ; i++){
      //   this.markerManager.deleteMarker(event)
      // }
    }
    this.selectedMarker = {
      lat: event.latitude,
      lng: event.longitude
    };
  }

  // markerDragEnd( lat, lng, $event: AGMMouseEvent) {    
  //   this.selectedMarker = {
  //     lat: $event.coords.lat,
  //     lng: $event.coords.lng
  //   };
  // }
  

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
 }

onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
}

markerDragEnd( lat, lng, $event: AGMMouseEvent) {
  // console.log($event.coords.lat);
  
  // this.selectedMarker = {
  //   lat: $event.coords.lat,
  //   lng: $event.coords.lng
  // };
  console.log($event);
  this.Latitude = $event.coords.lat;
  this.Longitude = $event.coords.lng;
  this.getAddress(this.Latitude, this.Longitude);
}

getAddress(latitude, longitude) {
  //this.geoCoder.geocode({ 'location': { Latitude: latitude, Longitude: longitude } }, (results, status) => {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
    console.log(results);
    console.log(status);
    if (status === 'OK') {
      if (results[0]) {
        this.zoom = 12;
        this.address = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
    console.log(this.address);
    this.Location = this.address;
    let updatedAddress: any = {
      address: this.Location,
      lat: latitude, 
      long: longitude
    }
    this.markerAddress.emit(updatedAddress);
  });
}
}
