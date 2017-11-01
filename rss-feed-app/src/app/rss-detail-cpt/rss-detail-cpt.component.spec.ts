import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RssDetailCptComponent } from './rss-detail-cpt.component';

describe('RssDetailCptComponent', () => {
  let component: RssDetailCptComponent;
  let fixture: ComponentFixture<RssDetailCptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RssDetailCptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RssDetailCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
