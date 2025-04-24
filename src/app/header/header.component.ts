import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  router=inject(Router)

    // Method to check if the user is logged in
    isLoggedIn(): boolean {
      return localStorage.getItem('auth-token') !== null;
    }
  

  logout(){
    localStorage.removeItem('auth-token');  // Remove token from localStorage
    this.router.navigate(['/login']);
  }

}
