import { Component, inject, OnInit, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  // onCaptcha($event: Event) {
  //   this.captchaResponse = response;
  // }
  // Method called when the reCAPTCHA response is resolved

  captchaResponse: string = ''; // Variable to store reCAPTCHA response
  loginForm!: FormGroup;

  password: any;
  loading: boolean = false;
  errmsg: string = '';

  // private tokenKey = 'auth-token';

  fb = inject(FormBuilder);
  userService = inject(AuthenticationService);
  router = inject(Router);

  // constructor(private fb: FormBuilder) {}
  onCaptchaResolved(response: string) {
    this.captchaResponse = response; // Store the reCAPTCHA response
  }

  ngOnInit(): void {
    // Initializing the form with FormBuilder
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

    localStorage.clear();
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  // You can handle form submission here
  onSubmitUserData() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      const captchaResponse = grecaptcha.getResponse();

      // Perform login action, etc.
      if (!captchaResponse) {
        alert('Please complete the CAPTCHA');
        return;
      }
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
      recaptchaResponse: this.captchaResponse,
    };
    this.userService.login(loginData).subscribe(
      (response: any) => {
        console.log('Login successful');
        console.log('Login response:', response);

        if (response && response.token) {
          console.log('token:', response.token);
          // localStorage.setItem('token', response.token); // Store the token in localStorage
          this.userService.setToken(response.token);
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
