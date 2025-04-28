import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token = '';
  valid = false;
  newPassword = '';
  message = '';
 
  employeeForm:any
  response: any
 

  private router =inject(Router)
  constructor(private myService: AuthenticationService, private route: ActivatedRoute, private fb: FormBuilder) {}
 
  // ngOnInit() {
  //   this.employeeForm = this.fb.group({
  //     password: ['', Validators.required]});
 
  //   this.token = this.route.snapshot.queryParamMap.get('token') || '';
  //   this.myService.validateToken(this.token).subscribe(v => this.valid = v);
  //   console.log('token', this.token)
  // }


  ngOnInit() {

    this.employeeForm = this.fb.group({
      password: ['', Validators.required]
    });
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (this.token) {
      this.myService.validateToken(this.token).subscribe(
        (valid) => {
          this.valid = valid;
          if (!this.valid) {
            this.message = 'This password reset link is invalid or has already been used.';
          }
        },
        (error) => {
          this.valid = false;
          this.message = 'Error validating the token. Please try again.';
        }
      );
    }
    console.log('Token:', this.token);
  }
  
 
  // reset() {
  //   if (this.valid) {
  //     this.myService.resetPassword(this.token, this.employeeForm.value['password']).subscribe((res) => {
  //       this.response=res;
  //       alert(this.response.message)

        
  //       this.router.navigate(['/login']);
  //     });
  //   }
  // }


  reset() {
    if (this.valid) {
      this.myService.resetPassword(this.token, this.employeeForm.value['password']).subscribe(
        (res) => {
          this.response = res;
          alert(this.response.message);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
          this.message = 'Error resetting password. Please try again.';
        }
      );
    }
  }
  
}
