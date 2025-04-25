import { Component, inject, resolveForwardRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: any[] = [];
  // page: number = 1;
  searchKeyword: string = '';
  searchControl = new FormControl('');
  totalusers: number = 0;
  pageSize: number = 10;
  currentPage = 1;

  // router = inject(Router);

  constructor(
    private router: Router,
    private userService: AuthenticationService
  ) {}
  ngOnInit(): void {
    // debugger;
    this.loadAllUsers(this.currentPage - 1);
    // // localStorage.removeItem('auth-token');
    // localStorage.getItem('auth-token')
    console.log('in ngOnit');

    this.userService.getAllusers(this.currentPage - 1, 10).subscribe({
      next: (data) => {
        this.userService.getToken();
        console.log('Users fetched:', data); // Debug log
        this.users = data.content;
        this.totalusers = data.totalElements;

        this.currentPage = data.number + 1;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert(`Error: ${error.status} - ${error.statusText}`);
      },
    });
  }

  searchUsers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadAllUsers(this.currentPage - 1);
      return;
    }

    this.userService.searchUsers(this.searchKeyword).subscribe((res) => {
      this.users = res.content;
    });
  }

  clearSearch() {
    this.searchKeyword = '';
    this.loadAllUsers(this.currentPage - 1);
  }

  loadAllUsers(page: number): void {
    this.userService.getAllusers(page, 10).subscribe({
      next: (response) => {
        console.log('Paginated Users fetched:', response);
        this.users = response.content; // .content contains the actual user list
        this.totalusers = response.totalElements;
      },
      error: (error) => {
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
    this.currentPage = page;
    this.loadAllUsers(this.currentPage - 1); // again, backend uses 0-based page
  }

  showImage: boolean = true;

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
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalusers);
    return `${start} – ${end} of ${this.totalusers} users`;
  }
}
