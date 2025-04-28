import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  showImage: boolean = true;
  file!: File; // Variable to store file

  userForm!: FormGroup;
  userId!: number;
  selectedImage!: File;
  user: any;
  profileImage: any;

  constructor(
    private fb: FormBuilder,
    private userService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef // Inject ChangeDetectorRef
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
      // this.profileImage = this.userService.getProfileImage(user.id); // Replace with your actual logic
this.user = user;

if (user.profileImage) {
  this.userService.getProfileImage(user.profileImage).subscribe({
    next: (imageData: any) => {
      const base64Data = btoa(
        new Uint8Array(imageData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      this.profileImage = 'data:image/jpeg;base64,' + base64Data;
      this.showImage = true;
    },

    error: (err) => {
      console.error('Error fetching profile image', err);
      this.profileImage = ''; // If image fetch fails, show initials.
      this.showImage = false; // Show initials.
    },
  });
} else {
  this.profileImage = ''; // If no profile image, show initials.
  this.showImage = false; // Show initials.
}
    });



  }

  

  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage = file;
  //     // this.userForm.patchValue({
  //     //   profileImage: file, // Update the form's profileImage field
  //     // });
  //     this.uploadProfileImage(this.userId);
  //   }
  // }
  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage=file;
  //     console.log("selected image : "+this.selectedImage.name);
      
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.profileImage = e.target.result;
  //       this.showImage = true;
  //     };
  //     reader.readAsDataURL(this.selectedImage);

  //     const formData = new FormData();
  //     formData.append('file', this.selectedImage, this.selectedImage.name);
 
  //   this.userService.updateProfileImage(this.userId,this.selectedImage).subscribe({
  //     next:(image:any)=>{
  //       console.log("name inside updateprofileimage"+this.selectedImage.name);
        
  //       const uploadedFileName = this.selectedImage.name; // assuming the backend just returns the fileName
  //       console.log("this is image data"+image);
        
  //       const imageUrl = `${uploadedFileName}`; 

  //       this.profileImage = imageUrl;
  //       this.showImage = true;


  //       // if (image && image.url) {
  //       //   this.profileImage = image.url;  // Set profile image URL from the backend
  //       //   this.showImage = true;
  //       //   console.log("Image updated successfully.");
  //       // } else {
  //       //   console.error("No image URL returned from server.");
  //       // }
  //       // this.selectedImage=image;
  //       // this.profileImage = URL.createObjectURL(this.selectedImage); 
  //       // this.showImage = true;
  //       console.log("image updated successfull....onflechange :====="+this.profileImage);
        
  //     },      error: (err) => {
  //       console.error('Error updating profile image', err);
  //     }
  //   })
     
  //   }
  // }


  //old filechnge method

  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage = file;
      
  //     // Create a preview of the image
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.profileImage = e.target.result;
  //       this.showImage = true;
  //     };
  //     reader.readAsDataURL(file);
      
  //     // Upload the image immediately when selected
  //     // this.uploadProfileImage(this.userId);


  //   }
  // }


  // Update your uploadProfileImage method
// uploadProfileImage(userId: number): void {
//   if (this.selectedImage) {
//     const formData = new FormData();
//     formData.append('file', this.selectedImage, this.selectedImage.name);
    
//     this.userService.updateProfileImage(userId, this.selectedImage).subscribe({
//       next: (response) => {
//         console.log("selected file image name : "+this.selectedImage.name);
//         console.log("selected file image size : "+this.selectedImage.size);
        
//         console.log('Profile image updated successfully');
//         console.log('Profile image updated response '+response);
//         // No need to set profileImage again as we already set it in onFileChange
//         this.cdRef.detectChanges();
//       },
//       error: (error) => {
//         console.error('Error updating profile image', error);
//         // Handle error - maybe revert to old image or show a message
//         this.showImage = false;
//       }
//     });
//   }
// }



onFileChange(event: any) {
  const file = event.target.files[0]; // Get the selected file

  if (file) {
    console.log('File selected:', file.name);

    const formData = new FormData();
    formData.append('file', file, file.name); // Append the file to FormData

    const userId = this.user.id; // Assuming you have user information with id
    console.log("user id  in onfilechagne : "+userId);
    

    // Send a PUT request to upload the image to the backend
    this.userService.updateProfileImage(userId, file).subscribe(
      (response:any) => {
          if(typeof(response==='object'))
            this.profileImage = response; // Assuming the backend returns the image URL
          console.log("response =="+response  +"    and profileimage ::=====>"+this.profileImage);
          

        console.log("response in updatre : "+response);
        
        console.log('Image uploaded successfully:', response);
        // Optionally, update the profileImage to display the uploaded image
        // this.profileImage = response; // Assuming the backend returns the image URL
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }
}
  
  // uploadProfileImage(userId: number) {
  //   if (this.selectedImage) {
  //     this.userService
  //       .updateProfileImage(userId, this.selectedImage)
  //       .subscribe({
  //         next: (response) => {
  //           console.log("user id in profile : "+userId);
            
  //           console.log('Profile image updated successfully');
  //           this.profileImage = URL.createObjectURL(this.selectedImage); 
  //           this.showImage = true;

  //           this.userForm.patchValue({
  //             profileImage: this.selectedImage,
  //           });

  //           this.cdRef.detectChanges();
  //           // maybe show success toast?

            
  //         },
  //         error: (error) => {
  //           console.error('Error updating profile image', error);
  //         },
  //       });
  //   }
  // }

  onImageError() {
    this.profileImage = ''; // If image fails, remove it and show initials.
    this.showImage = false; // Trigger initials to be shown.
  }

  // Generate initials from full name
  getInitials(fullName: string): string {
    if (!fullName) return '';
    const nameParts = fullName.trim().split('.');
    const first = nameParts[0]?.charAt(0).toUpperCase() || '';
    const last = nameParts[1]?.charAt(0).toUpperCase() || '';
    return first + last;
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
