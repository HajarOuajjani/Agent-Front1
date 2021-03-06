import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Agent } from 'src/app/patagee/models/agent';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  constructor(private httpClient: HttpClient) {}

  authentificate(email, password) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(email + ':' + password),
    });
    return this.httpClient
      .get<Agent>('http://localhost:9191/agent/' + email, { headers, })
      .pipe(
        map((userData) => {
          sessionStorage.setItem('email', email);
          console.log('userData : ' + JSON.stringify(userData));
          console.log('Is logged in ' + this.isUserLoggedIn());

          return userData;
        })
      );
  }
  isUserLoggedIn() {
    let user = sessionStorage.getItem('email');
    console.log('user:' + user);
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('email');
  }
}
