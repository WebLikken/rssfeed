import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RssListCptComponent } from './rss-list-cpt.component';

describe('RssListCptComponent', () => {
  let component: RssListCptComponent;
  let fixture: ComponentFixture<RssListCptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RssListCptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RssListCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
