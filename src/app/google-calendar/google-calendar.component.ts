import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { interval, BehaviorSubject } from 'rxjs';

import { GcalendarService } from '../calendar-services/gcalendar.service';
import { GCalendar, GCalendarEvent } from '../calendar-services/gCalendar';
import { ErrorResponse } from '../calendar-services/response';
import { FileNode, FileDatabase } from '../database-services/database.service';


const MS_PER_SECOND = 1000;

@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.css'],
  providers: [FileDatabase]
})
export class GoogleCalendarComponent implements OnInit {
  file:           any;
  clientData:     object;
  isAuthResponse: boolean;
  isAuthorized:   boolean = false;
  isListed:       boolean = false;
  userCode:       string;
  interval:       number;
  minutes:        number = 30;
  seconds:        number = 0;
  calendarArray:  GCalendar[] = [];
  eventsArray:    GCalendarEvent[] = [];

  // Database instances
  database:          FileDatabase;
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource:  MatTreeNestedDataSource<FileNode>;
  dataChange:        BehaviorSubject<FileNode[]>;
  results:           FileNode[] = [];

  constructor(private gcalendarService: GcalendarService, database: FileDatabase) {
    // Database object structure
    this.database = database;
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }
  ngOnInit() { }
  onSubmit() { console.log("Submitted Google calendar"); }

  _getChildren = (node: FileNode) => node.children;

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  fileListener($event): void {
    this.readDocument($event.target);
  }

  readDocument(document: any): void {
    const file: File = document.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      const strVal = reader.result.toString();
      this.clientData = JSON.parse(strVal);
    }
    reader.readAsText(file);
  }

  createCalendarObject() {
    if(!this.clientData["installed"]["client_id"]
        || !this.clientData["installed"]["auth_uri"]
        || !this.clientData["installed"]["client_secret"]) { 
        alert("Unable to parse JSON file.");
        return; // this is sychronous so we should be okay here.
    }
    this.gcalendarService.setClientID(this.clientData["installed"]["client_id"]);
    this.gcalendarService.setClientSecret(this.clientData["installed"]["client_secret"]);
    this.gcalendarService.oauthSignIn()
      .subscribe(
        data => this.showAccessCode(JSON.stringify(data))
      );
  }

  checkStatus() {
    this.gcalendarService.pollStatus()
      .subscribe(
        response => this.handlePollingResponse(JSON.stringify(response))
      );
  }

  listCalendars() {
    if(!this.isListed) {
      this.isListed = true;
      this.gcalendarService.listCalendars().subscribe(
        response => this.displayCalendars(JSON.stringify(response))
      );
    } 
  }

  listEvents(calendar: GCalendar) {
    let id: string = calendar.id;
    this.gcalendarService.findCalendarEvents(id)
    .subscribe(response => 
      this.displayEvents(JSON.stringify(response))
    );
  }

  private showAccessCode(data: string) {
    this.isAuthResponse = true;
    let accessData = JSON.parse(data);
    let countTo = parseInt(accessData["expires_in"], 10);
    this.userCode = accessData["user_code"];
    this.gcalendarService.setDeviceCode(accessData["device_code"]);
    let source = interval(MS_PER_SECOND);

    source.subscribe(_ => {
        if(countTo > 0) {
          countTo--;
          this.minutes = Math.floor(countTo / 60);
          this.seconds = Math.floor(countTo % 60);
        }
      }
    );
  }

  private handlePollingResponse(response: string) {
    console.log("Raw response: " + response);
    let parsedResponse = JSON.parse(response);
    if(parsedResponse["status"] == undefined && parsedResponse["access_token"]) { // 200 OK returns no status
      this.gcalendarService.setAccessToken(parsedResponse["access_token"]);
      this.gcalendarService.setRefreshToken(parsedResponse["refresh_token"]);
      this.gcalendarService.setTokenType(parsedResponse["token_type"]);
      this.isAuthorized = true;
    } else {
      this.parseErrorResult(parsedResponse);
    }
  }

  parseErrorResult(error: Object) {
    let message = "An unknown error occurred";
    if(error["status"] == ErrorResponse.PENDING) {
      message = "Awaiting permission from the authorization server";
    } else if(error["status"] == ErrorResponse.FORBIDDEN) {
      message = "Permission was denied by the user";
    } else if (error["status"] == ErrorResponse.UNKNOWN) {
      message = "Polling too often... please wait a moment and try again";
    }

    let nodeString = JSON.stringify({
      Details: {
        StatusCode: error["status"],
        Name: error["error"]["error"],
        Message: message,
        MessageDetails: error["error"]["error_description"]
      }
    });

    let nodes = this.database.buildFileTree(JSON.parse(nodeString), 0);
    nodes.forEach(element => {
      this.results.push(element);
    });
    
    this.database.dataChange.next(this.results);
  }

  private displayCalendars(response: string) {
    let calendarData = JSON.parse(response);
    calendarData.items.forEach(cal => { 
      console.log("Adding calendar: " + cal);
      this.calendarArray.push(cal);
    });
  }

  private displayEvents(response: string) {
    let eventData = JSON.parse(response);
    eventData.items.forEach(event => {
      this.eventsArray.push(event);
      console.log("Events Array: " + this.eventsArray);
    });
  }
}