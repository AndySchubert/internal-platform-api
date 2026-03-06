import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-verify-email',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="verify-container">
      <div class="verify-card">
        <h1>Email Verification</h1>
        
        <div *ngIf="loading" class="status-message loading">
          <p>Verifying your email address...</p>
        </div>
        
        <div *ngIf="!loading && success" class="status-message success">
          <p>Success! Your email has been verified.</p>
          <a routerLink="/login" class="btn btn-primary">Proceed to Login</a>
        </div>
        
        <div *ngIf="!loading && error" class="status-message error">
          <p>{{ error }}</p>
          <a routerLink="/register" class="btn btn-secondary">Back to Registration</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .verify-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 60px);
      padding: 20px;
    }
    .verify-card {
      background: var(--surface-card);
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    h1 { margin-bottom: 24px; color: var(--text-primary); }
    .status-message { margin-bottom: 24px; font-size: 16px; line-height: 1.5; }
    .success p { color: #155724; }
    .error p { color: #721c24; }
    .btn { display: inline-block; width: 100%; padding: 12px; border-radius: 4px; text-decoration: none; font-weight: 500; margin-top: 16px; }
    .btn-primary { background: var(--primary-color); color: white; }
    .btn-secondary { background: #e2e8f0; color: #475569; }
  `]
})
export class VerifyEmailComponent implements OnInit {
    loading = true;
    success = false;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');

        if (!token) {
            this.loading = false;
            this.error = "No verification token provided in the URL.";
            return;
        }

        this.authService.verifyEmail(token).subscribe({
            next: () => {
                this.loading = false;
                this.success = true;
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.detail || "Invalid or expired verification link.";
            }
        });
    }
}
