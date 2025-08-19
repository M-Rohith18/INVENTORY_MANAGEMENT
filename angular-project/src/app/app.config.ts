import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(ReactiveFormsModule),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideToastr()
  ]
};
