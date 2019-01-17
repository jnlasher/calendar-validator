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

  constructor(private exchangeService: ExchangeService) {
    this.server = 'https://outlook.office365.com/';
    this.user = '';
    this.password = '';
    this.svcAcct = false;
    this.resourceAcct = '';
    this.parser = new Parser();
  }

  ngOnInit() { }

  ngOnDestroy() { }

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
    this.getFolderId();
    /*
    this.exchangeService.getFolderId()
        .subscribe(
          data => { this.response = this.exchangeService.setFolderId(data) }
        );
    */
  }

  getFolderId(): void {
    this.exchangeService.getFolderId()
      .subscribe(
        data => console.log("Component data: \n" + JSON.stringify(data))
      )
  }

  setServiceAccount() {
    this.svcAcct = !this.svcAcct;
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.calendar); }
  // TODO: Remove after testing
  get xmlResponse() { return JSON.stringify(this.response); }
}
