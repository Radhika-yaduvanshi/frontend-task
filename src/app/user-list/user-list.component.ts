import { Component, inject } from '@angular/core';
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
  page: number = 1;
  searchKeyword: string = '';
  searchControl = new FormControl('');

  router = inject(Router);

  constructor(private userService: AuthenticationService) {}
  ngOnInit(): void {
    // debugger;
    this.loadAllUsers();

    this.userService.getAllusers().subscribe({
      next: (data) => {
        console.log('Users fetched:', data); // Debug log
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert(`Error: ${error.status} - ${error.statusText}`);
      },
    });
  }

  searchUsers(): void {
    if (this.searchKeyword.trim() === '') {
      this.loadAllUsers(); // fallback to show all users
      return;
    }

    this.userService.searchUsers(this.searchKeyword).subscribe((res) => {
      this.users = res;
    });
  }

  clearSearch() {
    this.searchKeyword = '';
    this.loadAllUsers(); // Or clear this.users = [];
  }

  loadAllUsers(): void {
    this.userService.getAllusers().subscribe((res) => {
      this.users = res;
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
  }
}
