import { Component, OnInit } from '@angular/core';
import { GcalendarService } from '../calendar-services/gcalendar.service';

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.css']
})
export class GoogleCalendarComponent implements OnInit {
  file:any;
  clientData: object;

  constructor(private gcalendarService: GcalendarService) { }
  ngOnInit() { }
  onSubmit() { console.log("Submitted Google calendar"); }

  fileListener($event): void {
    // console.log("CHANGE DETECTED");
    this.readDocument($event.target);
  }

  readDocument(document: any): void {
    // console.log("IN READ DOCUMENT");
    const file: File = document.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      // console.log("ON LOAD END");
      const strVal = reader.result.toString();
      this.clientData = JSON.parse(strVal);
    }
    reader.readAsText(file);
  }

  createCalendarObject() {
    console.log("Input client ID: " + this.clientData["installed"]);
    this.gcalendarService.setClientID(this.clientData["installed"]["client_id"]);
    this.gcalendarService.setAuthURI(this.clientData["installed"]["auth_uri"]);
    this.gcalendarService.setClientSecret(this.clientData["installed"]["client_secret"]);
    this.gcalendarService.oauthSignIn()
      .subscribe(
        data => console.log(data)
      );
  }
}
