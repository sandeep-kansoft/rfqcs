import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CommonService } from '../services/common.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private commonServices: CommonService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        
        if (err.status === 401) {
          this.commonServices.logout();
        }

        const error =
          (err.error && err.error.message) ||
          (err.error && err.error.errorMessage) ||
          err.statusText;
        return throwError(() => err.error);
      })
    );
  }
}
