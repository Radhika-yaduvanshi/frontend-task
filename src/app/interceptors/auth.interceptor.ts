// // import { HttpInterceptorFn } from '@angular/common/http';
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

// // import { map, Observable } from 'rxjs';
// import { inject, Injectable } from '@angular/core';
// import { AuthenticationService } from '../services/authentication.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authservice=inject(AuthenticationService);
//   const currentUser =authservice.getToken();

//   if(currentUser){
//    req=req.clone({
//      setHeaders:{
//        Authorization: `Bearer ${currentUser}`,
//        'Content-Type': 'application/json'
//      }
//    })
//   }

//   return next(req);
// };




// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token && token.trim() !== '') {
      console.log('AuthInterceptor: Token =', token);

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(req);
  }
}
