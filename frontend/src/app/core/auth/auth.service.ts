import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // undefined means we haven't checked yet. null means unauthenticated.
  private currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Attempt to load session on startup
    this.loadCurrentUser().subscribe();
  }

  login(credentials: LoginCredentials): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return this.http.post(
      `${environment.apiUrl}/api/v1/auth/login`,
      formData
    ).pipe(
      tap(() => {
        this.loadCurrentUser().subscribe();
      })
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/v1/auth/register`,
      data
    );
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/v1/auth/verify-email`,
      { token }
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/api/v1/auth/logout`, {}).subscribe({
      next: () => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      }
    });
  }

  checkAuth(): Observable<boolean> {
    // For AuthGuard: if already loaded, return it. Else fetch it.
    if (this.currentUserSubject.value !== undefined) {
      return of(!!this.currentUserSubject.value);
    }
    return this.loadCurrentUser().pipe(
      map(user => !!user)
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${environment.apiUrl}/api/v1/auth/me`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    return user === undefined ? null : user;
  }
}
