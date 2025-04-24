import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  password: any;
  loading: boolean = false;
  errmsg: string = '';
  grecaptcha!: any;
  // private tokenKey = 'auth-token';

  fb = inject(FormBuilder);
  userService = inject(AuthenticationService);
  router = inject(Router);

  // constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initializing the form with FormBuilder
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    localStorage.clear();
  }

  // You can handle form submission here
  onSubmitUserData() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Perform login action, etc.
    }

    // const recaptchaResponse = grecaptcha.getResponse(); // Get the response from reCAPTCHA

    // if (!recaptchaResponse) {
    //   alert('Please complete the CAPTCHA');
    //   return;
    // }

    const loginData = {
      userName: this.loginForm.get('userName')?.value,
      password: this.loginForm.get('password')?.value,
      // recaptchaResponse: recaptchaResponse, // Add the reCAPTCHA response to your login data
    };
    this.userService.login(loginData).subscribe(
      (response: any) => {
        console.log('Login successful');
        console.log('Login response:', response);

        if (response && response.token) {
          console.log('token:', response.token);
          localStorage.setItem('token', response.token); // Store the token in localStorage
          this.router.navigate(['']); // Navigate to the admin page
        } else {
          console.error('Token not found in the response');
          this.errmsg = 'Failed to retrieve token.';
        }
      },
      (error) => {
        console.log('Login Failed');
        this.errmsg = 'Invalid username and password. Please try again!';
      },
      () => {
        // Set loading to false once the request is completed
        this.loading = false;
      }
    );
  }
}
