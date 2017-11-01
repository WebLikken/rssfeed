import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RssCardCptComponent } from './rss-card-cpt.component';

describe('RssCardCptComponent', () => {
  let component: RssCardCptComponent;
  let fixture: ComponentFixture<RssCardCptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RssCardCptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RssCardCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
