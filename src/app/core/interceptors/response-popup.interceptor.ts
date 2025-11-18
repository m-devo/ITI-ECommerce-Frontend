import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export const ResponsePopupInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // Inject the NotificationService
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    // Success
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {

        // Only show POST & PUT & DELETE methods and not auth
        if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && !req.url.includes('api/auth'))  {
          const successMessage = event.body?.message || 'Operation completed successfully!';
          notificationService.showSuccess(successMessage);
        }
      }
    }),

    // Error
    catchError((error: HttpErrorResponse) => {

      if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && !req.url.includes('api/auth'))  {

        let errorMessage = 'error!';

        // Extract a error message
        if (error.error instanceof ErrorEvent) {

          // Client-side error
          errorMessage = `Error: ${error.error.message}`;

        } else {

          // Server-side error
          errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;

        }

        notificationService.showError(errorMessage);
      }

      // Re-throw the error
      return throwError(() => error);
    })
  );
};
