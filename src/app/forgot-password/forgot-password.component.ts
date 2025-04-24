import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  employeeForm: any
  response: any
 
  constructor(private myService: AuthenticationService, private fb: FormBuilder) { }
 
  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      email: ['', Validators.required]
    });
  }
 
  sendResetLink() {
    console.log("email", this.employeeForm)
    this.myService.forgotPassword(this.employeeForm.value['email']).subscribe((res) => {
      this.response = res;
      alert(this.response.message)
    });
  }
}
