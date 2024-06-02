import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set roles correctly on init', () => {
    const currentUser = { name: 'John', surname: 'Doe', roleId: 1 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(currentUser));

    component.ngOnInit();

    expect(component.isDoctor).toBeTrue();
    expect(component.isAdmin).toBeFalse();
    expect(component.isPatient).toBeFalse();
  });

  it('should return correct link for button labels', () => {
    expect(component.getLink('Locations')).toBe('/locations');
    expect(component.getLink('Doctors')).toBe('/doctors');
    expect(component.getLink('Appointments')).toBe('/appointment');
    expect(component.getLink('Profile')).toBe('/profile');
    expect(component.getLink('Users')).toBe('/users');
    expect(component.getLink('Patients')).toBe('/patients');
    expect(component.getLink('ContactInfo')).toBe('/contactinfo');
    expect(component.getLink('ContactForms')).toBe('/contact-forms');
    expect(component.getLink('Unknown')).toBe('/');
  });
});
