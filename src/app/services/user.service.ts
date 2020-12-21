import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../interfaces/User';
import { AuthenticationRequest } from '../interfaces/authentication-request';
import { RegisterRequest } from '../interfaces/register-request';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User;

  constructor(
    private httpClient: HttpClient,
    @Inject('api_url') private apiUrl: string
  ) {}

  public get currentUser(): User {
    if (!this.user) {
      const storageUser: string = window.sessionStorage.getItem('user');

      if (storageUser) {
        try {
          this.user = JSON.parse(storageUser);
        } catch (e) {
          window.sessionStorage.removeItem('user');
        }
      }
    }

    return this.user;
  }

  login(credentials: AuthenticationRequest): Observable<User> {
    return this.httpClient
      .post<User>(`${this.apiUrl}/api/login`, credentials)
      .pipe(
        tap((user: User) => {
          window.sessionStorage.setItem('user', JSON.stringify(user));
          this.user = user;
        })
      );
  }

  logout(): void {
    window.sessionStorage.removeItem('user');
    this.user = null;
  }

  registerAuthor(registeRequest: RegisterRequest): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}/api/register`,
      registeRequest
    );
  }

  registerAdministrator(registeRequest: RegisterRequest): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}/api/administrator/register`,
      registeRequest
    );
  }
}
