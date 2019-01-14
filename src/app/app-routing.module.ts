import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { GoogleCalendarComponent } from './google-calendar/google-calendar.component';
import { MsExchangeComponent } from './ms-exchange/ms-exchange.component';
import { OfficeThreesixfiveComponent } from './office-threesixfive/office-threesixfive.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'google-calendar', component: GoogleCalendarComponent},
  { path: 'office-365', component: OfficeThreesixfiveComponent},
  { path: 'ms-exchange', component: MsExchangeComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
