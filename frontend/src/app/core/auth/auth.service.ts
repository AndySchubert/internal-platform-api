import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

export interface LoginCredentials {
  username: string; // email
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user from token on service initialization
    if (this.isAuthenticated()) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.http.post<TokenResponse>(
      `${environment.apiUrl}/api/v1/auth/login`,
      formData
    ).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/api/v1/auth/register`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Basic token expiration check (JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
