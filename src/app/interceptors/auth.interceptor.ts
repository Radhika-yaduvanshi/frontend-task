// import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

// import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice=inject(AuthenticationService);
  const currentUser = authservice.getToken();

  if(currentUser){
   req=req.clone({
     setHeaders:{
       Authorization: `Bearer ${currentUser}`,
       'Content-Type': 'application/json'
     }
   })
  }

  return next(req);
};
