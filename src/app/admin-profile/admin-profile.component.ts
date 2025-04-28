import { Component, inject, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent {
  @ViewChild('fileInput') fileInput: any;
  user: any;
  showImage: boolean = true;
  selectedImage: any;
  profileImage!: string;

  getProfileImageUrl(imagePath: string): string {
    // 👈 Adjust to your backend's base URL
    return '';
  }
  authorId!: number | undefined;
  author: any;
  errorMessage: string = '';
  userProfile: any;
  private userService = inject(AuthenticationService);
  private domSanitizer = inject(DomSanitizer);
  private router = inject(Router);

  ngOnInit() {
    this.userService.getUserIdFromToken().subscribe({
      next: (id) => {
        this.authorId = id;
        console.log('User ID:', id);

        this.userService.getUserById(id).subscribe({
          next: (user) => {
            this.author = user;
            console.log('User Data:', user);

            if (user.profileImage) {
              this.userService.getProfileImage(user.profileImage).subscribe({
                next: (imageData: any) => {
                  const base64Data = btoa(
                    new Uint8Array(imageData).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );
                  this.userProfile = 'data:image/jpeg;base64,' + base64Data;
                },
              });
            }
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            this.errorMessage = 'Failed to load user data.';
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user ID:', err);
        this.errorMessage = 'Could not fetch user ID from token.';
      },
    });
  }

  update(userId: number): any {
    this.router.navigate(['/edit-profile', userId]);
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
  onImageError() {
    this.showImage = false;
  }

  // Generate initials from full name
  getInitials(fullName: string): string {
    if (!fullName) return '';
    const nameParts = fullName.trim().split('.');
    const first = nameParts[0]?.charAt(0).toUpperCase() || '';
    const last = nameParts[1]?.charAt(0).toUpperCase() || '';
    return first + last;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      this.selectedImage = file;

      // Now call your update profile method
      this.uploadProfileImage(this.authorId!);
      console.log('id in onfile selected method : ' + this.authorId!);
    }
  }
  openFileSelector() {
    // This will trigger the file input click event
    this.fileInput.nativeElement.click();
  }

  // UpdateProfile method
  uploadProfileImage(userId: number) {
    if (this.selectedImage) {
      console.log('selected file : ' + this.selectedImage);

      this.userService.getUserIdFromToken().subscribe({
        next: (id) => {
          this.userService
            .updateProfileImage(id, this.selectedImage)
            .subscribe({
              next: (response) => {
                console.log('Profile image updated successfully', response);

                //refresh page
                this.ngOnInit();
                const reader = new FileReader();
                reader.onload = () => {
                  this.userProfile = reader.result as string;
                  console.log('user profile : ' + this.userProfile);
                };
                reader.readAsDataURL(this.selectedImage); // read selected image as base64

                this.profileImage = URL.createObjectURL(this.selectedImage); // Preview image
              },
              error: (error) => {
                console.error('Error updating profile image', error);
                alert('An error occurred while uploading the profile image.');
              },
            });
        },
      });
    }
  }
}
