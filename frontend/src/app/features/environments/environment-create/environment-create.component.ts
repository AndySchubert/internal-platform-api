import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EnvironmentsService } from '../environments.service';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../../shared/models/project.model';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-environment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './environment-create.component.html',
  styleUrl: './environment-create.component.css'
})
export class EnvironmentCreateComponent implements OnInit {
  environmentForm: FormGroup;
  project: Project | null = null;
  projectId: string | null = null;
  loading = false;
  error: string | null = null;
  showTtl = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private environmentsService: EnvironmentsService,
    private projectsService: ProjectsService
  ) {
    this.environmentForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['persistent', [Validators.required]],
      ttl_hours: [null]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    if (this.projectId) {
      this.loadProject();
    }

    // Watch type changes to show/hide TTL field
    this.environmentForm.get('type')?.valueChanges.subscribe(type => {
      this.showTtl = type === 'ephemeral';
      if (this.showTtl) {
        this.environmentForm.get('ttl_hours')?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.environmentForm.get('ttl_hours')?.clearValidators();
        this.environmentForm.get('ttl_hours')?.setValue(null);
      }
      this.environmentForm.get('ttl_hours')?.updateValueAndValidity();
    });
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

  onSubmit(): void {
    if (this.environmentForm.invalid) {
      return;
    }

    if (!this.projectId) return;

    this.loading = true;
    this.error = null;

    const formValue = this.environmentForm.value;
    const envData = {
      name: formValue.name,
      type: formValue.type,
      ttl_hours: formValue.type === 'ephemeral' ? formValue.ttl_hours : undefined
    };

    this.environmentsService.createEnvironment(this.projectId, envData).subscribe({
      next: (environment) => {
        this.loading = false;
        this.router.navigate(['/projects', this.projectId, 'environments']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'Failed to create environment';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects', this.projectId, 'environments']);
  }
}
