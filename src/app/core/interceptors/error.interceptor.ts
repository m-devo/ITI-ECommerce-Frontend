import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// Functional interceptor to handle HTTP errors
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // Log error to console (in production, you might want to send to a logging service)
      console.error('HTTP Error:', error);

      // You can handle specific error codes here
      if (error.status === 401) {
        // Unauthorized - could redirect to login
        console.error('Unauthorized request - please login');
      } else if (error.status === 403) {
        // Forbidden
        console.error('Access forbidden');
      } else if (error.status === 500) {
        // Server error
        console.error('Server error occurred');
      }

      // Pass the error to the subscriber
      return throwError(() => error);
    })
  );
};
