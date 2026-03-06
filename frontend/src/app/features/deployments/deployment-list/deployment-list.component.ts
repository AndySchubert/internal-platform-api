import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeploymentsService } from '../deployments.service';
import { EnvironmentsService } from '../../environments/environments.service';
import { Deployment } from '../../../shared/models/deployment.model';
import { Environment } from '../../../shared/models/environment.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';


@Component({
  selector: 'app-deployment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, StatusBadgeComponent],
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
  ) { }

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
        this.deployments = deployments;
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
    this.pollingSubscription = this.deploymentsService.pollDeployments(this.environmentId).subscribe({
      next: (deployments) => {
        // Only update if statuses changed
        const hasChanges = this.deployments.some((dep) => {
          const newDep = deployments.find(d => d.id === dep.id);
          return newDep && newDep.status !== dep.status;
        });
        if (hasChanges) {
          this.deployments = deployments;
        }
      },
      error: () => {
        // Silently fail polling
      }
    });
  }
}
