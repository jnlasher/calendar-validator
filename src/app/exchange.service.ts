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
  private abstractCalendar: Calendar;
  private baseURL = 'EWS/Exchange.asmx';
  private responseCodeMatch = new RegExp('\<m:ResponseCode>(.+?)\<');
  private folderIdMatch = new RegExp('<t:FolderId Id="(.+?)"');
  private changekeyIdMatch = new RegExp('ChangeKey="(.+?)"');
  private response: ErrorResponse;
  private exchImpString: string;

  responseObservable = new Observable((observer) => {
    observer.next(this.response);
    observer.complete();
  });

  constructor(private http: HttpClient) { }

  getFolderId(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + btoa(this.abstractCalendar.username + ":" + this.abstractCalendar.password)
    });
    const requestURL : string = this.abstractCalendar.serverAddress + this.baseURL;
    const baseXML : string = `<?xml version="1.0" encoding="utf-8"?>
                                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                       xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"
                                       xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
                                       xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                                  <soap:Header>
                                    <t:RequestServerVersion Version="Exchange2007_SP1" />
                                    ${this.exchImpString}
                                  </soap:Header>
                                  <soap:Body>
                                    <m:GetFolder>
                                      <m:FolderShape>
                                        <t:BaseShape>IdOnly</t:BaseShape>
                                      </m:FolderShape>
                                      <m:FolderIds>
                                        <t:DistinguishedFolderId Id="calendar" />
                                      </m:FolderIds>
                                    </m:GetFolder>
                                  </soap:Body>
                                </soap:Envelope>`

    return this.http
      .post(
        requestURL, baseXML, {headers: headers, responseType: 'text'}
      ).pipe(catchError(this.handleError()));
  }

  getImpersonationRole(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + btoa(this.abstractCalendar.username + ":" + this.abstractCalendar.password)
    });
    const requestURL : string = this.abstractCalendar.serverAddress + this.baseURL;
    const baseXML : string = `<?xml version="1.0" encoding="utf-8"?>
                                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                                       xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"
                                       xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
                                       xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                                  <soap:Header>
                                    ${this.exchImpString}
                                  </soap:Header>
                                  <soap:Body>
                                    <m:GetFolder>
                                      <m:FolderShape>
                                        <t:BaseShape>IdOnly</t:BaseShape>
                                      </m:FolderShape>
                                      <m:FolderIds>
                                        <t:DistinguishedFolderId Id="calendar" />
                                      </m:FolderIds>
                                    </m:GetFolder>
                                  </soap:Body>
                                </soap:Envelope>`

    return this.http
      .post(
        requestURL, baseXML, {headers: headers, responseType: 'text'}
      ).pipe(catchError(this.handleError()));
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
}
