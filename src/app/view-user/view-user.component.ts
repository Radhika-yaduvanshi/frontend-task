import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-view-user',
  standalone: false,
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css',
})
export class ViewUserComponent implements OnInit {
  user: any;
  userId!: number;
  profileImage: any;
  showImage: boolean = true;

  constructor(
    private userService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get userId from route parameters
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    // Fetch user data
    this.userService.getUserById(this.userId).subscribe((user) => {
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
}
