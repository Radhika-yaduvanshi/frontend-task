import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: any[] = [];
  page: number = 1;

  constructor(private userService: AuthenticationService) {}
  ngOnInit(): void {
    // debugger;
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

  onPageChange(page: number): void {
    this.page = page;
  }
  
}
