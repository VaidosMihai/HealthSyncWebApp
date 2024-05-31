import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;

  locations = [
    { lat: 44.4268, lng: 26.1025, title: 'Bucharest' },
    { lat: 46.7712, lng: 23.6236, title: 'Cluj Napoca' },
    { lat: 45.7489, lng: 21.2087, title: 'Timisoara' },
    { lat: 45.6579, lng: 25.6012, title: 'Brasov' },
    { lat: 46.3607, lng: 25.8015, title: 'Miercurea Ciuc' },
    { lat: 47.1585, lng: 27.6014, title: 'Iasi' },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 45.9432, lng: 24.9668 },
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Adding markers to the map
    this.locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
        title: location.title
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<h5>${location.title}</h5>`
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }
}
