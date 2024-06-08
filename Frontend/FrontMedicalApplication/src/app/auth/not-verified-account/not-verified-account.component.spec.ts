import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotVerifiedAccountComponent } from './not-verified-account.component';

describe('NotVerifiedAccountComponent', () => {
  let component: NotVerifiedAccountComponent;
  let fixture: ComponentFixture<NotVerifiedAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotVerifiedAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotVerifiedAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
