import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  successMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const { email, password } = this.registerForm.value;
    this.authService.register({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.detail || 'Success! Please check your email to verify your account.';
        this.registerForm.reset();
      },
      error: (err) => {
        this.loading = false;

        // Safely extract the error message from the backend response
        let errorMessage = 'Registration failed. Please try again.';
        if (err.error && typeof err.error.detail === 'string') {
          errorMessage = err.error.detail;
        } else if (err.error && Array.isArray(err.error.detail)) {
          errorMessage = err.error.detail[0]?.msg || errorMessage;
        }

        // Output specific validation errors to the form controls if possible
        if (errorMessage.toLowerCase().includes('already registered')) {
          this.registerForm.get('email')?.setErrors({ alreadyRegistered: true });
        } else {
          this.error = errorMessage;
        }
      }
    });
  }
}
