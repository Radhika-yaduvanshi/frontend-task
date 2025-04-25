import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
user: any;
showImage: boolean = true;

  getProfileImageUrl(imagePath: string): string {
     // 👈 Adjust to your backend's base URL
     return ""
  }
  authorId: number | undefined;
  author: any;
  errorMessage: string = '';
  private userService = inject(AuthenticationService);
  private domSanitizer = inject(DomSanitizer);
  private router = inject(Router)

  ngOnInit() {
    this.userService.getUserIdFromToken().subscribe({
      next: (id) => {
        this.authorId = id;
        console.log('User ID:', id);

        this.userService.getUserById(id).subscribe({
          next: (user) => {
            this.author = user;
            console.log('User Data:', user);
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            this.errorMessage = 'Failed to load user data.';
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user ID:', err);
        this.errorMessage = 'Could not fetch user ID from token.';
      }
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

}
