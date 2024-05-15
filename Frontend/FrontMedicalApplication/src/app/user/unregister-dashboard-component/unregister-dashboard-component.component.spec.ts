import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisterDashboardComponent } from './unregister-dashboard-component.component';

describe('UnregisterDashboardComponent', () => {
  let component: UnregisterDashboardComponent;
  let fixture: ComponentFixture<UnregisterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnregisterDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnregisterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
