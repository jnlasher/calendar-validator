import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Calendar } from '../calendar';
import { ExchangeService } from '../exchange.service';
import { ErrorResponse } from '../response';

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
  isErrorResult: boolean;
  private faultCodeMatch = new RegExp('<faultcode .*>a:(.+?)<\/faultcode>');
  private faultStringMatch = new RegExp('<faultstring .*>(.+?)<\/faultstring>');

  constructor(private exchangeService: ExchangeService) {
    this.server = 'https://outlook.office365.com/';
    this.user = '';
    this.password = '';
    this.svcAcct = false;
    this.resourceAcct = '';
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
  }

  getFolderId(): void {
    this.exchangeService.getFolderId()
      .subscribe(
        data => this.parseResponse(data)
      );
  }

  setServiceAccount() {
    this.svcAcct = !this.svcAcct;
  }

  parseResponse(data: Observable<any>) {
    // TODO - might be a good idea to build an interceptor
    // on the service end, because this is a little hacky
    if(typeof data == "string") {
      this.response = "Success!";
      this.isErrorResult = false;
    } else if (typeof data == "object") {
      console.log("Error:\n" + JSON.stringify(data));
      this.parseErrorResult(data);
      this.isErrorResult = true;
    }
  }

  parseErrorResult(result: object): void {
    if(result["status"] == ErrorResponse.UNAUTHORIZED) {
      this.response = "Unauthorized; the password you entered is likely wrong."
    } else if(result["status"] == ErrorResponse.NOT_FOUND) {
      this.response = "Not Found; the username you entered is likely wrong."
    } else if(result["status"] == ErrorResponse.SERVER_ERROR) {
      this.response = this.faultCodeMatch.exec(result["error"])[1] + " " +
                      this.faultStringMatch.exec(result["error"])[2];
    }
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.calendar); }
}
