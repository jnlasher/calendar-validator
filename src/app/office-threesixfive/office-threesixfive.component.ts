import { Component, OnInit } from '@angular/core';

import { Parser } from 'xml2js';

import { Calendar } from '../calendar';
import { ExchangeService } from '../exchange.service';

@Component({
  selector: 'app-office-threesixfive',
  templateUrl: './office-threesixfive.component.html',
  styleUrls: ['./office-threesixfive.component.css']
})
export class OfficeThreesixfiveComponent implements OnInit {
  server: string;
  user: string;
  password: string;
  svcAcct: boolean;
  resourceAcct: string;
  calendar: Calendar;
  response: string;
  parser: Parser;

  // ################## Constructor ####################### //
  constructor(private exchangeService: ExchangeService) {
    // Fields for O365
    this.server = 'https://outlook.office365.com/';
    this.user = '';
    this.password = '';
    this.svcAcct = false;
    this.resourceAcct = '';
    this.parser = new Parser();
  }

  // ################## Service Calls #################### //

  // ################## Helper Methods ################### //
  // Angular on init method
  ngOnInit() { }

  // Toggles the service account option
  setServiceAccount() {
    this.svcAcct = !this.svcAcct;
  }

  // Submit the form
  onSubmit() {
    // Build the calendar with the form details
    // and add it to the service
    this.calendar = new Calendar(
      this.server,
      this.user,
      this.password,
      this.svcAcct,
      this.resourceAcct
    );
    this.exchangeService.setCalendar(this.calendar);

    // First step is to find the folder ID
    this.exchangeService.getFolderId()
    .subscribe(data => {console.log(JSON.stringify(data))});
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.calendar); }
  // TODO: Remove after testing
  get xmlResponse() { return JSON.stringify(this.response); }
}
