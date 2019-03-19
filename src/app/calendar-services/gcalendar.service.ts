import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from './response'

@Injectable({
  providedIn: 'root'
})
export class GcalendarService {
  // Google's OAuth 2.0 endpoint for requesting an access token
  private oauth2Endpoint: string = 'https://accounts.google.com/o/oauth2/device/code';
  private scope:          string = "https://www.googleapis.com/auth/calendar.readonly";
  private response:       ErrorResponse;
  private clientID:       string;
  private authURI:        string;
  private clientSecret:   string;

  responseObservable = new Observable((observer) => {
    observer.next(this.response);
    observer.complete();
  });

  constructor(private http: HttpClient) { }

  setClientID(clientID: string) { this.clientID = clientID; }
  setAuthURI(authURI: string) { this.authURI = authURI; }
  setClientSecret(clientSecret: string) { this.clientSecret = clientSecret; }

  oauthSignIn() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    console.log("Client ID: " + this.clientID);
    console.log("Scope: " + this.scope);
    const data = {
      "client_id": this.clientID,
      "scope": this.scope
    };
    return this.http
      .post(
        this.oauth2Endpoint, data, {headers: headers, responseType: 'json'}
      ).pipe(catchError(this.handleError()));
  }

  private handleError<ErrorResponse> () {
    return (error: any): Observable<ErrorResponse> => {
      return of(error);
    }
  }
}
