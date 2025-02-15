import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreescreenComponent } from './threescreen.component';

describe('ThreescreenComponent', () => {
  let component: ThreescreenComponent;
  let fixture: ComponentFixture<ThreescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreescreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
