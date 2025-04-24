import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Using Angular's inject function to get the router instance
  const token = localStorage.getItem('auth-token'); // Check if the token exists in localStorage

  if (token) {
    return true; // Allow access if token is present
  }

  // Redirect to login page if not authenticated
  router.navigate(['/login']);
  return false;
  // return true;
};
