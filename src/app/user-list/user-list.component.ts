import { Component, inject, resolveForwardRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';

interface User {
  id: number;
  name: string;
  role: string;
  // You can add any other properties you expect here, e.g., profileImage, email, etc.
}
@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  errorMessage: string | null = null;

  // router = inject(Router);
  users: any[] = [];
  searchKeyword: string = '';
  totalusers: number = 0;
  profileImage: any;
  showImage: boolean = true;
  page: number = 0; // Backend uses 0-based page index
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  filteredUsers = [...this.users]; /// Filtered users based on the dropdown
  filterOption = 'all';
  pagedUsers: any[] = [];
  selectedFile: File | null = null;

  selectedFileName: string | null = null;
  // currentPage = 1;

  // router = inject(Router);

  constructor(
    private router: Router,
    private userService: AuthenticationService
  ) {}
  ngOnInit(): void {
    // debugger;
    // this.filterOption = 'all'; // Set default
    this.loadAllUsers();
    // this.nonDeletedUsers()
    // // localStorage.removeItem('auth-token');
    // localStorage.getItem('auth-token')
    console.log('in ngOnit');
    console.log('admins');

    // this.getAllAdmins();
  }

  uploadExcel(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = this.selectedFile.name
      .split('.')
      .pop()
      ?.toLowerCase();
    if (!validExtensions.includes(`.${fileExtension}`)) {
      this.errorMessage = 'Invalid file type. Please select an Excel file.';
      return;
    }

    this.errorMessage = null;

    this.userService.uploadUserExcel(this.selectedFile).subscribe({
      next: () => {
        alert('Excel uploaded successfully!');
        this.selectedFile = null;
        this.selectedFileName = null;

        this.errorMessage = null;
      },
      error: (err) => {
        if (err.status === 400 && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Upload failed: Unknown error occurred.';
        }
      },
    });
  }

  downloadUserTemplate() {
    this.errorMessage = null;

    this.userService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'UserTemplate.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.errorMessage = null; // Clear any previous error
      },
      error: (err) => {
        // Handle download failure
        this.errorMessage =
          err.error || 'Download failed: Unknown error occurred.';
      },
    });
  }

  // // Filter users based on the selected option
  // filterUsers() {
  //   if (this.filterOption === 'all') {
  //     this.filteredUsers = [...this.users]; // Show all users
  //   } else if (this.filterOption === 'admin') {
  //     this.filteredUsers = this.users.filter(
  //       (user) => user.accessRole === 'ADMIN'
  //     ); // Show admins only
  //   } else if (this.filterOption === 'user') {
  //     this.filteredUsers = this.users.filter(
  //       (user) => user.accessRole === 'USER'
  //     ); // Show regular users only
  //   }
  // }

  filterUsers() {
    this.page = 0;
    const role =
      this.filterOption !== 'all' ? this.filterOption.toUpperCase() : '';

    this.userService.getUserByRole(this.page, this.pageSize, role).subscribe({
      next: (res) => {
        if (res && res.content) {
          this.users = res.content;
          this.pagedUsers = [...this.users]; // ✅ Don’t call updatePagedUsers
          this.totalElements = res.totalElements;
          this.totalPages = res.totalPages;

          this.filteredUsers = [...this.users];

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
                  console.error('Error loading image for', user.userName);
                },
              });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error filtering users:', err);
      },
    });
  }

  updatePagedUsers(): void {
    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Update the paged users based on filtered data
    this.pagedUsers = this.filteredUsers.slice(startIndex, endIndex);

    // Update total pages based on the filtered users
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  searchUsers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadAllUsers();
      return;
    }

    this.page = 0; // Reset to the first page for search results

    this.userService.searchUsers(this.searchKeyword).subscribe((res: any) => {
      console.log('Search Response:', res); // Log the full response here
      console.log('content' + res.content);

      if (res && Array.isArray(res)) {
        this.users = res;
        this.pagedUsers = this.users;

        this.filteredUsers = [...res];
        this.totalElements = res.length;
        this.totalPages = Math.ceil(res.length / this.pageSize);
        this.updatePagedUsers();
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

  loadUsersByRole(): void {
    const role = this.filterOption === 'admin' ? 'ADMIN' : 'USER';
    this.userService.getUserByRole(this.page, this.pageSize, role).subscribe({
      next: (response) => {
        this.users = response.content;
        this.pagedUsers = this.users;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error loading users by role:', err);
      },
    });
  }
  loadAllUsers(): void {
    if (this.filterOption !== 'all') {
      this.loadUsersByRole();
      return;
    } else if (this.searchKeyword?.trim()) {
      this.searchUsers();
      return;
    }

    this.userService.nonDeletedUsers(this.page, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Paginated Users fetched:', response);

        if (response && Array.isArray(response.content)) {
          this.users = response.content;
          this.pagedUsers = [...this.users]; // ✅ Just assign it directly
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;

          this.filteredUsers = [...this.users]; // ✅ Keep consistency

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
        } else {
          this.users = [];
          this.pagedUsers = [];
          this.totalElements = 0;
          this.totalPages = 1;
        }
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
          this.filterUsers();
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

  // onPageChange(page: number): void {
  //   this.page = page;
  //   // this.nonDeletedUsers();
  //   this.loadAllUsers(); // again, backend uses 0-based page
  //   // this.updatePagedUsers();
  // }
  onPageChange(newPage: number): void {
    if (newPage < 0 || (this.totalPages > 0 && newPage >= this.totalPages)) {
      return;
    }

    this.page = newPage;
    this.loadAllUsers();
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

  nonDeletedUsers() {
    this.userService.nonDeletedUsers().subscribe((res: any) => {
      this.users = res;
      console.log('response : ' + res);

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
    });
  }

  // getAllAdmins(){
  //   this.userService.getAllusers().subscribe((res)=>{
  //     console.log("All users : "+res);

  //     const admin=res.filter((user: { role: string; })=>user.role==='admin')
  //     console.log("admins "+admin);
  //     this.filteredUsers = admin;
  //     console.log("Filterusers : "+this.filterUsers);

  //   })
  // }
}
