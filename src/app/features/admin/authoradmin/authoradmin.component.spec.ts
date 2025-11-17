import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoradminComponent } from './authoradmin.component';

describe('AuthoradminComponent', () => {
  let component: AuthoradminComponent;
  let fixture: ComponentFixture<AuthoradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoradminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthoradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
