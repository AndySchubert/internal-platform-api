import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EnvironmentsService } from '../environments.service';
import { ProjectsService } from '../../projects/projects.service';
import { Environment } from '../../../shared/models/environment.model';
import { Project } from '../../../shared/models/project.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { HeaderComponent } from '../../../layout/header/header.component';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-environment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, StatusBadgeComponent, HeaderComponent],
  templateUrl: './environment-list.component.html',
  styleUrl: './environment-list.component.css'
})
export class EnvironmentListComponent implements OnInit, OnDestroy {
  environments: Environment[] = [];
  project: Project | null = null;
  loading = false;
  error: string | null = null;
  projectId: string | null = null;
  private pollingSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private environmentsService: EnvironmentsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    if (this.projectId) {
      this.loadProject();
      this.loadEnvironments();
      this.startPolling();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadProject(): void {
    if (!this.projectId) return;
    this.projectsService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load project';
      }
    });
  }

  loadEnvironments(): void {
    if (!this.projectId) return;
    this.loading = true;
    this.error = null;
    this.environmentsService.getEnvironments(this.projectId).subscribe({
      next: (environments) => {
        this.environments = environments;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load environments';
        this.loading = false;
      }
    });
  }

  startPolling(): void {
    if (!this.projectId) return;
    // Poll every 3 seconds to check for status updates
    this.pollingSubscription = interval(3000).pipe(
      switchMap(() => this.environmentsService.getEnvironments(this.projectId!))
    ).subscribe({
      next: (environments) => {
        // Only update if statuses changed
        const hasChanges = this.environments.some((env, index) => {
          const newEnv = environments.find(e => e.id === env.id);
          return newEnv && newEnv.status !== env.status;
        });
        if (hasChanges) {
          this.environments = environments;
        }
      },
      error: () => {
        // Silently fail polling
      }
    });
  }

  deleteEnvironment(id: string): void {
    if (!confirm('Are you sure you want to delete this environment? This will also delete all deployments.')) {
      return;
    }

    this.environmentsService.deleteEnvironment(id).subscribe({
      next: () => {
        this.loadEnvironments();
      },
      error: (err) => {
        alert(err.error?.detail || 'Failed to delete environment');
      }
    });
  }
}
