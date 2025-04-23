import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  getProfileImageUrl(imagePath: string): string {
     // 👈 Adjust to your backend's base URL
     return ""
  }
  authorId: number | undefined;
  author: any;
  errorMessage: string = '';
  private userService = inject(AuthenticationService);
  private domSanitizer = inject(DomSanitizer);

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

  sanitizeHTML(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }


}
