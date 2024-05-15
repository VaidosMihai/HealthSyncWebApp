import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRoutingModule } from './auth-routing.component';

describe('AuthRoutingComponent', () => {
  let component: AuthRoutingModule;
  let fixture: ComponentFixture<AuthRoutingModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRoutingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthRoutingModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
