import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeploymentsService } from '../deployments.service';
import { EnvironmentsService } from '../../environments/environments.service';
import { Deployment } from '../../../shared/models/deployment.model';
import { Environment } from '../../../shared/models/environment.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { HeaderComponent } from '../../../layout/header/header.component';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-deployment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, StatusBadgeComponent, HeaderComponent],
  templateUrl: './deployment-list.component.html',
  styleUrl: './deployment-list.component.css'
})
export class DeploymentListComponent implements OnInit, OnDestroy {
  deployments: Deployment[] = [];
  environment: Environment | null = null;
  environmentId: string | null = null;
  loading = false;
  error: string | null = null;
  private pollingSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deploymentsService: DeploymentsService,
    private environmentsService: EnvironmentsService
  ) {}

  ngOnInit(): void {
    this.environmentId = this.route.snapshot.paramMap.get('envId');
    if (this.environmentId) {
      this.loadEnvironment();
      this.loadDeployments();
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadEnvironment(): void {
    if (!this.environmentId) return;
    this.environmentsService.getEnvironment(this.environmentId).subscribe({
      next: (environment) => {
        this.environment = environment;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load environment';
      }
    });
  }

  loadDeployments(): void {
    if (!this.environmentId) return;
    this.loading = true;
    this.error = null;
    this.deploymentsService.getDeployments(this.environmentId).subscribe({
      next: (deployments) => {
        this.deployments = deployments.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load deployments';
        this.loading = false;
      }
    });
  }

  startPolling(): void {
    if (!this.environmentId) return;
    // Poll every 3 seconds to check for status updates
    this.pollingSubscription = interval(3000).pipe(
      switchMap(() => this.deploymentsService.getDeployments(this.environmentId!))
    ).subscribe({
      next: (deployments) => {
        // Only update if statuses changed
        const hasChanges = this.deployments.some((dep, index) => {
          const newDep = deployments.find(d => d.id === dep.id);
          return newDep && newDep.status !== dep.status;
        });
        if (hasChanges) {
          this.deployments = deployments.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      },
      error: () => {
        // Silently fail polling
      }
    });
  }
}
