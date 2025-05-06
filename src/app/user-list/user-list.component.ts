import { Component, inject, resolveForwardRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: any[] = [];
  searchKeyword: string = '';
  totalusers: number = 0;
  profileImage: any;
  showImage: boolean = true;
  page: number = 0; // Backend uses 0-based page index
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  // currentPage = 1;

  // router = inject(Router);

  constructor(
    private router: Router,
    private userService: AuthenticationService
  ) {}
  ngOnInit(): void {
    // debugger;
    this.loadAllUsers();
    // this.nonDeletedUsers()
    // // localStorage.removeItem('auth-token');
    // localStorage.getItem('auth-token')
    console.log('in ngOnit');
  }

  searchUsers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadAllUsers();
      return;
    }

    this.page = 0; // Reset to the first page for search results

    this.userService.searchUsers(this.searchKeyword).subscribe((res) => {
      console.log('Search Response:', res); // Log the full response here
      console.log('content' + res.content);

      if (res && Array.isArray(res)) {
        this.users = res;

        console.log(this.users);
        console.log(res);

        this.totalElements = res.length;
        this.totalPages = 1;
      } else {
        console.error('No results or invalid response:', res);
      }
    });
  }

  clearSearch() {
    this.searchKeyword = '';
    this.loadAllUsers();
  }

  // loadAllUsers(): void {
  //   this.userService.getAllusers(this.page, this.pageSize).subscribe({
  //     next: (response) => {
  //       console.log('Paginated Users fetched:', response);

  //       // Check if response.content exists
  //       if (response && Array.isArray(response.content)) {
  //         this.users = response.content; // Update this line to use response.content
  //         this.totalElements = response.totalElements;
  //         this.totalPages = response.totalPages;

  //         //retrive user image
  //         this.users.forEach((user, index) => {
  //           if (user.profileImage) {
  //             this.userService.getProfileImage(user.profileImage).subscribe({
  //               next: (imageData: any) => {
  //                 const base64Data = btoa(
  //                   new Uint8Array(imageData).reduce(
  //                     (data, byte) => data + String.fromCharCode(byte),
  //                     ''
  //                   )
  //                 );
  //                 this.users[index].profileImage =
  //                   'data:image/jpeg;base64,' + base64Data;
  //               },

  //               error: (err) => {
  //                 console.error('Error fetching profile image', err);
  //               },
  //             });
  //           } else {
  //             this.users[index].profileImage = 'assets/default-profile.png'; // fallback
  //           }
  //         });
  //       } else {
  //         console.error('Failed to load users:', response);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching users:', error);
  //     },
  //   });
  // }

  loadAllUsers(): void {
    this.userService.nonDeletedUsers(this.page, this.pageSize).subscribe({
      next: (response:any) => {
        console.log('Paginated Users fetched:', response);

        if (response && Array.isArray(response.content)) {
          this.users = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;

          this.users.forEach((user) => {
            if (user.profileImage) {
              this.userService.getProfileImage(user.profileImage).subscribe({
                next: (imageData: any) => {
                  const base64Data = btoa(
                    new Uint8Array(imageData).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ''
                    )
                  );
                  user.profileImage = 'data:image/jpeg;base64,' + base64Data;
                },
                error: (err) => {
                  console.error(
                    'Error loading profile image for user',
                    user.userName
                  );
                },
              });
            }
          });
        }

        // else {
        //   console.error('Failed to load users:', response);
        // }
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  // getUsers(): void {
  //   this.userService.getUsers().subscribe({
  //     next: (data) => {
  //       console.log('Users fetched:', data); // Debug log
  //       this.users = data;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching users:', error);
  //       alert(`Error: ${error.status} - ${error.statusText}`);
  //     },
  //   });
  // }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
          alert('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert(`Error: ${error.status} - ${error.statusText}`);
        },
      });
    }
  }

  update(userId: number): any {
    this.router.navigate(['/edit-user', userId]);
  }
  view(userId: number): any {
    this.router.navigate(['/view-user', userId]);
  }

  onPageChange(page: number): void {
    this.page = page;
    // this.nonDeletedUsers();
    this.loadAllUsers(); // again, backend uses 0-based page
  }

  // When image fails to load, this runs
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

  getDisplayedRange(): string {
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.totalusers);
    return `${start} – ${end} of ${this.totalusers} users`;
  }

  // Method to trigger Excel file download
  downloadUserExcel(): void {
    this.userService.downloadUsers().subscribe(
      (response: Blob) => {
        const fileName = 'users.xlsx'; // The file name for download
        const fileExtension = '.xlsx'; // Correct extension for Excel files

        // Ensure it's a valid Blob
        if (response && response instanceof Blob) {
          saveAs(response, fileName); // Trigger the download
        } else {
          console.error('Invalid file response');
          alert('There was an issue with the file download.');
        }
      },
      (error) => {
        console.error('Download error:', error);
        alert('There was an error while downloading the file.');
      }
    );
  }


  nonDeletedUsers(){
    this.userService.nonDeletedUsers().subscribe((res:any)=>{
      this.users=res;
      console.log("response : "+res);

     
      if (res && Array.isArray(res.content)) {
        this.users = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;

        this.users.forEach((user) => {
          if (user.profileImage) {
            this.userService.getProfileImage(user.profileImage).subscribe({
              next: (imageData: any) => {
                const base64Data = btoa(
                  new Uint8Array(imageData).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                );
                user.profileImage = 'data:image/jpeg;base64,' + base64Data;
              },
              error: (err) => {
                console.error(
                  'Error loading profile image for user',
                  user.userName
                );
              },
            });
          }
        });
      }

      
      
    })
  }
}
