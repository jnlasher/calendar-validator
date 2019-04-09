import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable, BehaviorSubject } from 'rxjs';

import { ExchangeService } from '../calendar-services/exchange.service';
import { FileNode, FileDatabase } from '../database-services/database.service';
import { Calendar } from '../calendar-services/calendar';
import { ErrorResponse } from '../calendar-services/response';

const FAULT_CODE_MATCH   = new RegExp('<faultcode .*>a:(.+?)<\/faultcode>');
const FAULT_STRING_MATCH = new RegExp('<faultstring .*>(.+?)<\/faultstring>');

@Component({
  selector: 'app-office-threesixfive',
  templateUrl: './office-threesixfive.component.html',
  styleUrls: ['./office-threesixfive.component.css'],
  providers: [FileDatabase]
})
export class OfficeThreesixfiveComponent implements OnInit {
  // Calendar identifiers
  server:       string;
  user:         string;
  password:     string;
  resourceAcct: string;
  premServer:   string;
  calendar:     Calendar;
  svcAcct:      boolean;
  hybrid:       boolean;
  hide:         boolean = true;

  // Database instances
  database:          FileDatabase;
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource:  MatTreeNestedDataSource<FileNode>;
  dataChange:        BehaviorSubject<FileNode[]>;
  results:           FileNode[] = [];

  constructor(private exchangeService: ExchangeService, database: FileDatabase) {
    // Server object structure
    this.server = 'https://outlook.office365.com/';

    // Database object structure
    this.database = database;
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  ngOnInit() { }

  ngOnDestroy() { }

  onSubmit() {
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
    this.exchangeService.getFolderId().subscribe(
        data => this.parseResponse(data)
      );
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  _getChildren = (node: FileNode) => node.children;

  setServiceAccount() { this.svcAcct = !this.svcAcct; }

  setHybridEnvironment() { this.hybrid = !this.hybrid; }

  parseResponse(data: Observable<any>) {
    if(typeof data == "string") {
      console.log("Success");
    } else if (typeof data == "object") {
      this.parseErrorResult(JSON.stringify(data));
    }
  }

  parseErrorResult(result: string): void {
    let parsedResult = JSON.parse(result);
    let message: string;
    let details: string;

    if(parsedResult["status"] == ErrorResponse.SERVER_ERROR) {
      message = FAULT_CODE_MATCH.exec(parsedResult["error"])[1];
      details = FAULT_STRING_MATCH.exec(parsedResult["error"])[1];
    } else if(parsedResult["status"] == ErrorResponse.UNAUTHORIZED) {
      message = "Unauthorized";
      details = "Double check the password that you entered";
    } else if(parsedResult["status"] == ErrorResponse.NOT_FOUND) {
      message = "Not Found";
      details = "Check the username matches the Exchange UPN";
    }

    let nodeString = JSON.stringify({
        Details: {
          StatusCode: parsedResult["status"],
          Name: parsedResult["name"],
          Message: message,
          MessageDetails: details
        }
    });

    let nodes = this.database.buildFileTree(JSON.parse(nodeString), 0);
    nodes.forEach(element => {
      this.results.push(element);
    });
    this.database.dataChange.next(this.results);
  }
}