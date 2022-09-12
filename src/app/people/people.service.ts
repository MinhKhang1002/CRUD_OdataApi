import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Odata } from '../model/odata';
import { People } from '../model/people.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  baseUrl: string =
    'https://services.odata.org/TripPinRESTierService/(S(1y21vtk3niychb14lpdqp3v3))/people';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getAllPeople(): Observable<Odata> {
    return this.http
      .get<Odata>(this.baseUrl)
      .pipe(catchError(this.handleError<Odata>('getAllPeoPle')));
  }

  // getAllPeopleASC(): Observable<Odata> {
  //   return this.http
  //     .get<Odata>(`${this.baseUrl}?$orderby=UserName`)
  //     .pipe(catchError(this.handleError<Odata>('getAllPeoPle')));
  // }

  // getAllPeopleDESC(): Observable<Odata> {
  //   return this.http
  //     .get<Odata>(`${this.baseUrl}?$orderby=UserName desc`)
  //     .pipe(catchError(this.handleError<Odata>('getAllPeoPle')));
  // }

  getPeople(username: string): Observable<People> {
    return this.http.get<People>(`${this.baseUrl}('${username}')`).pipe(
      tap((_) => console.log(`fetched People username=${username}`)),
      catchError(this.handleError<People>('getPeople'))
    );
  }

  addPeople(people: People): Observable<People> {
    return this.http.post<People>(this.baseUrl, people, this.httpOptions).pipe(
      tap((newPeoPle: People) =>
        console.log(`added hero w/ id=${newPeoPle.UserName}`)
      ),
      catchError(this.handleError<People>('addPeople'))
    );
  }

  deletePeople(UserName: string): Observable<People> {
    const url = `${this.baseUrl}('${UserName}')`;
    console.log(url);

    return this.http.delete<People>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted people UserName=${UserName}`)),
      catchError(this.handleError<People>('deletePeople'))
    );
  }

  updatePeople(people: People): Observable<People> {
    const url = `${this.baseUrl}('${people.UserName}')`;
    return this.http.patch<People>(url, people, this.httpOptions).pipe(
      tap((_) => console.log(`updated People UserName=${people.UserName}`)),
      catchError(this.handleError<People>('updatePeople'))
    );
  }
}
