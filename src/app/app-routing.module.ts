import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { authGuard } from './services/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent,

   },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin-profile', component: AdminProfileComponent,canActivate: [authGuard]},
  { path: 'user-list', component: UserListComponent,canActivate: [authGuard]},
  { path: 'edit-profile/:id', component: EditProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
