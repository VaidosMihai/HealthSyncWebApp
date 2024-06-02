import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationComponent } from './location.component';
import { ElementRef } from '@angular/core';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationComponent],
      providers: [
        { provide: ElementRef, useValue: { nativeElement: {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the map after view init', () => {
    spyOn(component, 'loadMap');
    component.ngAfterViewInit();
    expect(component.loadMap).toHaveBeenCalled();
  });

  it('should load the map', () => {
    const mapSpy = spyOn(google.maps, 'Map').and.callThrough();
    component.loadMap();
    expect(mapSpy).toHaveBeenCalled();
  });

  it('should add markers to the map', () => {
    const markerSpy = spyOn(google.maps, 'Marker').and.callThrough();
    component.loadMap();
    expect(markerSpy).toHaveBeenCalled();
  });
});
