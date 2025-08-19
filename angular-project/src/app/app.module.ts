// app.module.ts or auth.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';         // ✅ Import this
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';  // Adjust if path is different
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    FormsModule, 
    BrowserModule,
    ReactiveFormsModule,     // ✅ Add this
    HttpClientModule         // ✅ Needed for API calls
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useExisting: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
