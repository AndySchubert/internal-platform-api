import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeploymentsService } from '../deployments.service';
import { EnvironmentsService } from '../../environments/environments.service';
import { Environment } from '../../../shared/models/environment.model';


@Component({
  selector: 'app-deployment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './deployment-create.component.html',
  styleUrl: './deployment-create.component.css'
})
export class DeploymentCreateComponent implements OnInit {
  deploymentForm: FormGroup;
  environment: Environment | null = null;
  environmentId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private deploymentsService: DeploymentsService,
    private environmentsService: EnvironmentsService
  ) {
    this.deploymentForm = this.fb.group({
      version: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.environmentId = this.route.snapshot.paramMap.get('envId');
    if (this.environmentId) {
      this.loadEnvironment();
    }
  }

  loadEnvironment(): void {
    if (!this.environmentId) return;
    this.environmentsService.getEnvironment(this.environmentId).subscribe({
      next: (environment) => {
        this.environment = environment;
        if (environment.status !== 'running') {
          this.error = `Environment is not ready (status: ${environment.status}). Only running environments can receive deployments.`;
        }
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load environment';
      }
    });
  }

  onSubmit(): void {
    if (this.deploymentForm.invalid) {
      return;
    }

    if (!this.environmentId) return;

    if (this.environment?.status !== 'running') {
      this.error = 'Environment must be running to create a deployment';
      return;
    }

    this.loading = true;
    this.error = null;

    const { version } = this.deploymentForm.value;
    this.deploymentsService.createDeployment(this.environmentId, { version }).subscribe({
      next: (deployment) => {
        this.loading = false;
        this.router.navigate(['/environments', this.environmentId, 'deployments']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'Failed to create deployment';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/environments', this.environmentId, 'deployments']);
  }
}
