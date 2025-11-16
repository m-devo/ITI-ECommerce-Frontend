import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// HTTP errors
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      if (error.status === 401) {
        console.error('Unauthorized request - please login');
      } else if (error.status === 403) {
        console.error('Access forbidden');
      } else if (error.status === 500) {
        console.error('Server error occurred');
      }
      return throwError(() => error);
    })
  );
};
