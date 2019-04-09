import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Calendar } from './calendar';
import { ErrorResponse } from './response'

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private abstractCalendar:   Calendar;
  private baseURL:            string = 'EWS/Exchange.asmx';
  private responseCodeMatch:  RegExp = new RegExp('\<m:ResponseCode>(.+?)\<');
  private folderIdMatch:      RegExp = new RegExp('<t:FolderId Id="(.+?)"');
  private changekeyIdMatch:   RegExp = new RegExp('ChangeKey="(.+?)"');
  private response:           ErrorResponse;
  private exchImpString:      string;
  private soapEnvelope:       string;
  private folderDetails:      string;

  responseObservable = new Observable((observer) => {
    observer.next(this.response);
    observer.complete();
  });

  constructor(private http: HttpClient) {
    this.setSoapEnvelope();
    this.setFolderDetails();
  }

  getFolderId(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + btoa(this.abstractCalendar.username + ":" + this.abstractCalendar.password)
    });
    const requestURL : string = this.abstractCalendar.serverAddress + this.baseURL;
    const baseXML : string = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope ${this.soapEnvelope}>
      <soap:Header>
        <t:RequestServerVersion Version="Exchange2007_SP1" />
        ${this.exchImpString}
      </soap:Header>
      <soap:Body>
        ${this.folderDetails}
      </soap:Body>
    </soap:Envelope>`
    console.log("Base XML: " + baseXML);
    return this.http
      .post(requestURL, baseXML, {headers: headers, responseType: 'text'})
      .pipe(catchError(this.handleError()));
  }

  getImpersonationRole(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + btoa(this.abstractCalendar.username + ":" + this.abstractCalendar.password)
    });
    const requestURL : string = this.abstractCalendar.serverAddress + this.baseURL;
    const baseXML : string = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope ${this.soapEnvelope}>
      <soap:Header>
        ${this.exchImpString}
      </soap:Header>
      <soap:Body>
        ${this.folderDetails}
      </soap:Body>
    </soap:Envelope>`

    return this.http
      .post(requestURL, baseXML, {headers: headers, responseType: 'text'})
      .pipe(catchError(this.handleError()));
  }

  getEventData(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + btoa(this.abstractCalendar.username + ":" + this.abstractCalendar.password)
    });
    const requestURL : string = this.abstractCalendar.serverAddress + this.baseURL;
    const baseXML : string = `
    <soap:Envelope 
    xmlns:ns0="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:ns1="http://schemas.microsoft.com/exchange/services/2006/types" 
    xmlns:ns2="http://schemas.microsoft.com/exchange/services/2006/messages">
        <ns0:Header>
        </ns0:Header>
        <ns0:Body>
            <ns2:FindItem Traversal="Shallow">
                <ns2:ItemShape>
                    <ns1:BaseShape>Default</ns1:BaseShape>
                    <ns1:AdditionalProperties>
                        <ns1:FieldURI FieldURI="item:DateTimeCreated" />
                        <ns1:FieldURI FieldURI="calendar:IsRecurring" />
                        <ns1:FieldURI FieldURI="calendar:Organizer" />
                        <ns1:FieldURI FieldURI="calendar:Duration" />
                        <ns1:FieldURI FieldURI="calendar:LegacyFreeBusyStatus" />
                    </ns1:AdditionalProperties>
                </ns2:ItemShape>
                <ns2:CalendarView EndDate="2019-03-19T23:59:59.000000" StartDate="2019-03-19T00:00:00.000000" />
                <ns2:ParentFolderIds>
                    <ns1:DistinguishedFolderId Id="calendar">
                        <ns1:Mailbox>
                            <ns1:EmailAddress>jlasher@extron.com</ns1:EmailAddress>
                        </ns1:Mailbox>
                    </ns1:DistinguishedFolderId>
                </ns2:ParentFolderIds>
            </ns2:FindItem>
        </ns0:Body>
    </ns0:Envelope>`

    return this.http
      .post(requestURL, baseXML, {headers: headers, responseType: 'text'})
      .pipe(catchError(this.handleError()));
  }

  setFolderId(xmlData: string): string {
    let response: string = this.responseCodeMatch.exec(xmlData)[1];
    if (response == "NoError") {
      this.abstractCalendar.setFolderId(this.folderIdMatch.exec(xmlData)[1]);
      this.abstractCalendar.setChangeId(this.changekeyIdMatch.exec(xmlData)[1]);
    }
    return response;
  }

  setCalendar(calendar: Calendar): void {
    this.abstractCalendar = calendar;
    this.setResourceAccountHeader();
  }

  private handleError<ErrorResponse> () {
    return (error: any): Observable<ErrorResponse> => {
      return of(error);
    }
  }

  private setResourceAccountHeader(): void {
    if(this.abstractCalendar.enableSvcAcct) {
      this.exchImpString = `<t:ExchangeImpersonation>
                                <t:ConnectingSID>
                                    <t:SmtpAddress>${this.abstractCalendar.resourceAcct}</t:SmtpAddress>
                                </t:ConnectingSID>
                            </t:ExchangeImpersonation>`;
    } else if(!this.abstractCalendar.enableSvcAcct) {
      this.exchImpString = ``;
    }
  }

  private setSoapEnvelope(): void {
    this.soapEnvelope = `xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                        xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"
                        xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
                        xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"`;
  }

  private setFolderDetails(): void {
    this.folderDetails = `<m:GetFolder>
                              <m:FolderShape>
                                <t:BaseShape>IdOnly</t:BaseShape>
                              </m:FolderShape>
                              <m:FolderIds>
                                <t:DistinguishedFolderId Id="calendar" />
                              </m:FolderIds>
                            </m:GetFolder>`;
  }
}
