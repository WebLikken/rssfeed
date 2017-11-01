import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RssCardCptComponent } from './rss-card-cpt/rss-card-cpt.component';
import { RssListCptComponent } from './rss-list-cpt/rss-list-cpt.component';
import { RssDetailCptComponent } from './rss-detail-cpt/rss-detail-cpt.component';

@NgModule({
  declarations: [
    AppComponent,
    RssCardCptComponent,
    RssListCptComponent,
    RssDetailCptComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
