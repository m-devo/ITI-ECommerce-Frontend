import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { responsePopupInterceptor } from './core/interceptors/response-popup.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(
      withInterceptors([
        responsePopupInterceptor, 
        authInterceptor, 
        errorInterceptor
      ])
    )
  ],
};
