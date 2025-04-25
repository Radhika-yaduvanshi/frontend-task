import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  userForm!: FormGroup;
  userId!: number;
  selectedImage!: File;
  user: any;

  constructor(
    private fb: FormBuilder,
    private userService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form group with validation
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      userName: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      // profileImage: [''],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      accessRole: ['', Validators.required],
      // password: ['', Validators.required],
    });
    this.userService.getUserById(this.userId).subscribe((user) => {
      user.dob = this.datePipe.transform(user.dob, 'yyyy-MM-dd'); // format before patching
      this.userForm.patchValue(user);
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return; // Exit if form is invalid
    }

    const updatedUser = this.userForm.value; // Get the updated user data from the form

    // Send the form data to the backend
    this.userService.updateUser(updatedUser, this.userId).subscribe({
      next: (response) => {
        console.log('user id is : ' + this.userId);

        this.user = response;
        alert('User updated successfully');
        console.log('Success:', response);
        this.router.navigate(['/user-list']); // Navigate to the users list or another page
      },
      error: (error) => {
        alert('Error updating user');
        console.log('user id is : ' + this.userId);

        console.error('Error:', error);
      },
    });
  }
}
