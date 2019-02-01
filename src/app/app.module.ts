import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { FullMaterialModule } from './material-module';
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
    BrowserAnimationsModule,
    FullMaterialModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
