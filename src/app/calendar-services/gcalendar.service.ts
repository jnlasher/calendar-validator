import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from './response'

const DAY_START: string = "T00:00:00-05:00";
const DAY_END:   string = "T23:59:00-05:00";

@Injectable({
  providedIn: 'root'
})
export class GcalendarService {
  // Google's OAuth 2.0 endpoint for requesting an access token
  private baseEndpoint:   string = "https://www.googleapis.com/calendar/v3";
  private oauth2Endpoint: string = "https://accounts.google.com/o/oauth2/device/code";
  private scope:          string = "https://www.googleapis.com/auth/calendar.readonly";
  private tokenEndpoint:  string = "https://www.googleapis.com/oauth2/v4/token";
  private grantType:      string = "http://oauth.net/grant_type/device/1.0";
  private response:       ErrorResponse;
  private deviceCode:     string;
  private clientID:       string;
  private clientSecret:   string;
  private accessToken:    string;
  private refreshToken:   string;
  private tokenType:      string;
  
  responseObservable = new Observable((observer) => {
    observer.next(this.response);
    observer.complete();
  });

  constructor(private http: HttpClient) { }

  setClientID(clientID: string) { this.clientID = clientID; }
  setClientSecret(clientSecret: string) { this.clientSecret = clientSecret; }
  setDeviceCode(deviceCode: string) { this.deviceCode = deviceCode; }
  setAccessToken(accessToken: string) { this.accessToken = accessToken; }
  setRefreshToken(refreshToken: string) { this.refreshToken = refreshToken; }
  setTokenType(tokenType: string) { this.tokenType = tokenType; }

  oauthSignIn() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const data = {
      "client_id": this.clientID,
      "scope": this.scope
    };

    return this.http
      .post(this.oauth2Endpoint, data, {headers: headers, responseType: 'json'})
      .pipe(catchError(this.handleError()));
  }

  pollStatus() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const data = {
      "client_id": this.clientID,
      "client_secret": this.clientSecret,
      "code": this.deviceCode,
      "grant_type": this.grantType
    };

    return this.http
      .post(this.tokenEndpoint, data, {headers: headers, responseType: 'json'})
      .pipe(catchError(this.handleError()));
  }

  listCalendars() {
    if(!this.accessToken) { return; }
    let path = `/users/me/calendarList`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
    
    return this.http
      .get(this.baseEndpoint + path, {headers: headers, responseType: 'json'})
      .pipe(catchError(this.handleError()));
  }

  findCalendarEvents(calendarId: string) {
    if(!this.accessToken) { return; }
    let path = `/calendars/${calendarId}/events`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });

    let date = new Date();
    let dayMin = `${date.getFullYear()}-0${date.getUTCMonth() + 1}-${date.getUTCDate()}${DAY_START}`;
    let dayMax = `${date.getFullYear()}-0${date.getUTCMonth() + 1}-${date.getUTCDate()}${DAY_END}`;

    let params = new HttpParams();
    params = params.append('timeMin', dayMin);
    params = params.append('timeMax', dayMax);

    return this.http
      .get(this.baseEndpoint + path, {headers: headers, params: params, responseType: 'json'})
      .pipe(catchError(this.handleError()));
  }

  private handleError<ErrorResponse> () {
    return (error: any): Observable<ErrorResponse> => {
      return of(error);
    }
  }
}