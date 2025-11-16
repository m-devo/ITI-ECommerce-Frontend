import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementBar } from './announcement-bar';

describe('AnnouncementBar', () => {
  let component: AnnouncementBar;
  let fixture: ComponentFixture<AnnouncementBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
