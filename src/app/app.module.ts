import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GoogleCalendarComponent } from './google-calendar/google-calendar.component';
import { OfficeThreesixfiveComponent } from './office-threesixfive/office-threesixfive.component';
import { MsExchangeComponent } from './ms-exchange/ms-exchange.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    GoogleCalendarComponent,
    OfficeThreesixfiveComponent,
    MsExchangeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
