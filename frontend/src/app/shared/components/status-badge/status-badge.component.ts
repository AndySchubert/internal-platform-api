import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css'
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getStatusClass(): string {
    const statusMap: Record<string, string> = {
      'provisioning': 'badge-warning',
      'running': 'badge-success',
      'failed': 'badge-error',
      'pending': 'badge-info',
      'succeeded': 'badge-success'
    };
    return statusMap[this.status.toLowerCase()] || 'badge-default';
  }

  getStatusLabel(): string {
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  }
}
