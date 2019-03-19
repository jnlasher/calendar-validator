import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {Observable, BehaviorSubject} from 'rxjs';

import { ExchangeService } from '../exchange.service';
import { FileNode, FileDatabase } from '../database.service';
import { Calendar } from '../calendar';
import { ErrorResponse } from '../response';

const FAULT_CODE_MATCH = new RegExp('<faultcode .*>a:(.+?)<\/faultcode>');
const FAULT_STRING_MATCH = new RegExp('<faultstring .*>(.+?)<\/faultstring>');

@Component({
  selector: 'app-office-threesixfive',
  templateUrl: './office-threesixfive.component.html',
  styleUrls: ['./office-threesixfive.component.css'],
  providers: [FileDatabase]
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
  hide = true;

  database: FileDatabase;
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  dataChange: BehaviorSubject<FileNode[]>;
  results: FileNode[] = [];

  constructor(private exchangeService: ExchangeService, database: FileDatabase) {
    // Server object structure
    this.server = 'https://outlook.office365.com/';

    // Database object structure
    this.database = database;
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    //this.dataChange = new BehaviorSubject<FileNode[]>(this.results);
    this.database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;
  private _getChildren = (node: FileNode) => node.children;

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

  setServiceAccount() { this.svcAcct = !this.svcAcct; }

  parseResponse(data: Observable<any>) {
    if(typeof data == "string") {
      // console.log("Message:\n" + data);
      this.response = "Success!";
      this.isErrorResult = false;
    } else if (typeof data == "object") {
      // console.log("Error:\n" + JSON.stringify(data));
      this.parseErrorResult(JSON.stringify(data));
      this.isErrorResult = true;
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

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.calendar); }
}