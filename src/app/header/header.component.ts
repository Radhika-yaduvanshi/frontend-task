import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  userProfile: any;
  userId!: number;
  user: any;

  router = inject(Router);
  userService = inject(AuthenticationService);

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('auth-token') !== null;
  }

  logout() {
    localStorage.removeItem('auth-token'); // Remove token from localStorage
    this.router.navigate(['/login']);
  }

  getuserprofile() {
    //getuerid from token

    this.userService.getUserIdFromToken().subscribe({
      next: (userId) => {
        console.log('User id in header : ' + userId);
        this.userId = userId;

        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            this.user = user;
            if (user.profileImage) {
              this.userService.getProfileImage(user.profileImage).subscribe({
                next: (profileImage) => {
                  const base64Data = btoa(
                    new Uint8Array(profileImage).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );
                  this.userProfile = 'data:image/jpeg;base64,' + base64Data;
                  // this.ngOnInit();
                },
              });
            }
          },
        });
      },
    });
  }

  ngOnInit(): void {
    this.getuserprofile();
  }
}
