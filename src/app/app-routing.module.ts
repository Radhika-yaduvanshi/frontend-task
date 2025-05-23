import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { authGuard } from './services/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user-list', component: UserListComponent, canActivate: [authGuard]},
  {path:'register',component:RegistrationComponent},
  {
    path: 'admin-profile',
    component: AdminProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'edit-profile/:id', component: EditProfileComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'view-user/:id', component: ViewUserComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
