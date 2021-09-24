import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(`${this.baseURL}login`, model).pipe(
      map((res: any) => {
        const user = res;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          sessionStorage.setItem('username', this.decodedToken.unique_name);

        }
      })
    )
  }

  
  register(model: any) {
    return this.http.post(`${this.baseURL}register`, model);
  }

  loggedIn() {
    const token: any = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  } 

}
