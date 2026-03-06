import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.currentUser = user ?? null;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
