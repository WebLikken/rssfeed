import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RssCardCptComponent } from './rss-card-cpt/rss-card-cpt.component';
import { RssListCptComponent } from './rss-list-cpt/rss-list-cpt.component';
import { RssDetailCptComponent } from './rss-detail-cpt/rss-detail-cpt.component';

const routes: Routes = [
  { path: '', component: RssListCptComponent },
  { path: 'page1', component: RssDetailCptComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RssCardCptComponent,
    RssListCptComponent,
    RssDetailCptComponent
  ],
  exports: [AppModule],
  imports: [
    BrowserModule,RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [RssListCptComponent]
})
export class AppModule { }
