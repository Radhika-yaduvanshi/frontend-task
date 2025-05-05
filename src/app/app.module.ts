import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { authGuard } from './services/auth.guard';
// import { AuthInterceptor, authInterceptor } from './interceptors/auth.interceptor';
import { UserListComponent } from './user-list/user-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DatePipe } from '@angular/common';
import { ViewUserComponent } from './view-user/view-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { saveAs } from 'file-saver';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    AdminProfileComponent,
    UserListComponent,
    EditProfileComponent,
    EditUserComponent,
    ViewUserComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  // providers: [DatePipe, provideHttpClient(withInterceptors([authInterceptor]))],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
