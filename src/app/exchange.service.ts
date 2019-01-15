import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Calendar } from './calendar';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private abstractCalendar: Calendar;
  private baseURL = 'EWS/Exchange.asmx';
  private responseCodeMatch = new RegExp('\<m:ResponseCode>(.*?)\<');
  private folderIdMatch = new RegExp('<t:FolderId Id="(.*?)"');
  private changekeyIdMatch = new RegExp('ChangeKey="(.*?)"');
  response: string;

  // ###################### Constructor ############################# //
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  // ################# Remote Server Requests ####################### //
  // Unfortunately (for Angular), this is a SOAP API, so
  // the repsonse has to be parsed through manually because
  // it's all in XML.
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

    return this.http.post(requestURL,
                          baseXML,
                          {headers: headers,
                          responseType: 'text'})
      .pipe(catchError(this.handleError()));
  }

  /** Finds the response results and sets the folder ID, if possible */
  setFolderId(xmlData: string): string {
    let response: string = this.responseCodeMatch.exec(xmlData)[1];
    console.log("SetFolder: " + response); // "NoError"
    if (response == "NoError") {
      this.abstractCalendar.setFolderId(this.folderIdMatch.exec(xmlData)[1]);
      this.abstractCalendar.setChangeId(this.changekeyIdMatch.exec(xmlData)[1]);
      console.log("values are set"); // Does log
    }
    return response;
  }

  setCalendar(calendar: Calendar): void {
    this.abstractCalendar = calendar;
  }

  checkErrorResponse(): string { return this.response; }

  // ################# Private Helper Methods ####################### //
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ExchangeService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
