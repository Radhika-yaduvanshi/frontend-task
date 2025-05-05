import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userId!: Number;
  user: any;
  totalUsers!: Number;
  profileImage: any;

  private userService = inject(AuthenticationService);
  private router = inject(Router);
  private rout = inject(ActivatedRoute);
  constructor() {}
  ngOnInit(): void {
    this.userId = Number(this.rout.snapshot.paramMap.get('id'));
    console.log('user id : ' + this.userId);

    this.userService.getUserIdFromToken().subscribe({
      next: (id) => {
        this.userId = id;
        console.log('User id in home page : ' + id);

        this.userService.getUserById(id).subscribe({
          next: (user) => {
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
                },

                error: (err) => {
                  console.error('Error fetching profile image', err);
                },
              });
            } else {
              this.profileImage = 'assets/default-profile.png'; // if no profile image
            }
          },
          error: (err) => {
            console.log('User not found');
          },
        });
      },
      error: (err) => {
        console.log('id not found');
      },
    });

    this.userService.countUsers().subscribe({
      next: (totalUsers: Number) => {
        this.totalUsers = totalUsers;
      },
    });

    // this.userService.getProfileImage(this.userId).subscribe({
    //   next: (image: any) => {
    //     this.profileImage = image;
    //   },
    // });
  }


  generateUsers(){
    
  }
}
