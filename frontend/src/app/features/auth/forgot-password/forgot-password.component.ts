import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="forgot-container" style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 60px); padding: 20px;">
      <div class="forgot-card" style="background: var(--surface-card); padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center;">
        <h1 style="margin-bottom: 24px; color: var(--text-primary);">Reset Password</h1>
        <p style="margin-bottom: 24px;">Enter your email and we'll send you a link to reset your password.</p>
        
        <div style="margin-bottom: 24px; text-align: left;">
          <label style="display: block; margin-bottom: 8px;">Email</label>
          <input type="email" class="form-control" placeholder="you@example.com" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--surface-input); color: var(--text-primary);" />
        </div>
        
        <button class="btn-primary" style="width: 100%; padding: 12px; border: none; border-radius: 4px; background: var(--primary-color); color: white; cursor: pointer; font-weight: 500;">Send Reset Link</button>
        
        <p style="margin-top: 24px;"><a routerLink="/login" style="color: var(--primary-color); text-decoration: none;">Back to Login</a></p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent { }
