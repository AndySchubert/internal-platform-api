import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="reset-container" style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 60px); padding: 20px;">
      <div class="reset-card" style="background: var(--surface-card); padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center;">
        <h1 style="margin-bottom: 24px; color: var(--text-primary);">Enter New Password</h1>
        
        <div style="margin-bottom: 24px; text-align: left;">
          <label style="display: block; margin-bottom: 8px;">New Password</label>
          <input type="password" class="form-control" placeholder="At least 8 characters" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--surface-input); color: var(--text-primary); margin-bottom: 16px;" />
          
          <label style="display: block; margin-bottom: 8px;">Confirm Password</label>
          <input type="password" class="form-control" placeholder="Confirm new password" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--surface-input); color: var(--text-primary);" />
        </div>
        
        <button class="btn-primary" style="width: 100%; padding: 12px; border: none; border-radius: 4px; background: var(--primary-color); color: white; cursor: pointer; font-weight: 500;">Reset Password</button>
      </div>
    </div>
  `
})
export class ResetPasswordComponent { }
