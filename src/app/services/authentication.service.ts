import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  updateAuthor(author: any) {
    throw new Error('Method not implemented.');
  }

  userId: number | undefined;
  constructor(private http: HttpClient) {}

  private apiUrl = '/user';

  // This is where you might save the JWT token after login
  private tokenKey = 'auth-token';

  login(adminData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/loginReq`, adminData, {
        responseType: 'json', // Ensure it's expecting JSON

        // });
      })
      .pipe(
        tap((response: any) => {
          console.log('API Response:', response);
          this.setToken(response.token);
        })
        // Log the response here
      );
  }
  getToken(): string {
    return localStorage.getItem('auth-token') || ''; // Return the token from localStorage (or an empty string if not available)
  }
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUserIdFromToken(): Observable<number> {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const userName = decodedToken.sub;

      return this.http.get<number>(
        `${this.apiUrl}/getuserIdByUserName/${userName}`,
        this.getAuthHeaders() // <-- Attach the token
      );
    } catch (error) {
      return throwError(() => new Error('Invalid token'));
    }
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserById/${userId}`);
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  getAllusers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllUsers`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`, {
      responseType: 'text',
    });
  }

  getProfileImageUrl(imagePath: string): string {
    return `${this.apiUrl}/user/${imagePath}`;
  }

  updateUser(id: number, updatedUser: any, selectedImage: File) {
    const formData = new FormData();

    // Append JSON object
    formData.append('user', JSON.stringify(updatedUser));

    // If an image is selected, append it as well
    if (selectedImage) {
      formData.append('image', selectedImage, selectedImage.name);
    }

    // Append user ID
    formData.append('id', id.toString());

    console.log('token in update : ' + this.getToken());

    // Set the Authorization header only (do not manually set Content-Type for FormData)
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.getToken()
    );

    // Make the PUT request with form data
    return this.http.put(`${this.apiUrl}/update`, formData, { headers });
  }

  searchUsers(keyword: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`, {
      ...this.getAuthHeaders(),
      responseType: 'json', // or 'text', 'blob', etc. based on what your API returns
    });
  }
}
