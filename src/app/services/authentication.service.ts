import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';
interface UploadResponse {
  fileName: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  profileImage!: string;
  updateAuthor(author: any) {
    throw new Error('Method not implemented.');
  }

  userId: number | undefined;
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8088/user';

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
    ``;
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

  // getAllusers(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getAllUsers`, {
  //     ...this.getAuthHeaders()// or 'text', 'blob', etc. based on what your API returns
  //   });
  // }
  // getAllusers(): Observable<any> {
  //   const token = this.getToken(); // Assuming this method exists
  //   return this.http.get(`${this.apiUrl}/getalluser`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // }

  getAllusers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getalluser?page=${page}&size=${size}`
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`, {
      responseType: 'text',
    });
  }

  getProfileImageUrl(imagePath: string): string {
    return `${this.apiUrl}/user/${imagePath}`;
  }

  updateUser(userData: any, id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, userData, {
      responseType: 'text',
    });
  }
  searchUsers(keyword: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}`, {
      ...this.getAuthHeaders(),
      responseType: 'json', // or 'text', 'blob', etc. based on what your API returns
    });
  }

  forgotPassword(email: string) {
    console.log(email);
    return this.http.post(this.apiUrl + `/forgot-password/${email}`, null);
  }

  validateToken(token: string) {
    return this.http.get<boolean>(this.apiUrl + `/validate-token/${token}`);
  }

  resetPassword(token: string, newPassword: string) {
    console.log(newPassword);
    return this.http.post(this.apiUrl + `/reset-password/${token}`, {
      password: newPassword,
    });
  }

  //download excelfile

  // Method to download the users as an Excel file
  downloadUsers(): Observable<Blob> {
    const headers = new HttpHeaders().set(
      'Accept',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    return this.http.get(`${this.apiUrl}/download-users`, {
      headers,
      responseType: 'blob',
    });
  }

  countUsers(): any {
    return this.http.get(`${this.apiUrl}/totalUsers`);
  }

  // getProfileImage(id: any): any {
  //   return this.http.get(`${this.apiUrl}/getProfileImage/${id}`);
  // }
  getProfileImage(imageName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getProfileImage/${imageName}`, {
      responseType: 'arraybuffer',
    });
  }

  // updateProfileImage(userId: number, file: File) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   console.log("file name  : in service : "+file.name);
  //   console.log("file size  : in service : "+file.size);
    
  //   return this.http.put<any>(`${this.apiUrl}/uploadProfileImage/${userId}`, formData);
  // }
  updateProfileImage(userId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
  
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('auth-token')}`
    );
  
    return this.http.post(
      `${this.apiUrl}/uploadProfileImage/${userId}`,
      formData,
      { headers }
    );
  }

  registerUsers(count:number):any{
    return this.http.post(`${this.apiUrl}/generate/${count}`,{})
  }

  // nonDeletedUsers(page: number = 0, size: number = 10):any{
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     `Bearer ${localStorage.getItem('auth-token')}`
  //   );
  //   return this.http.get(`${this.apiUrl}/getNonDeletedUsers`,{headers});
  // }

  nonDeletedUsers(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getNonDeletedUsers?page=${page}&size=${size}`
    );
  }
  
  
}
