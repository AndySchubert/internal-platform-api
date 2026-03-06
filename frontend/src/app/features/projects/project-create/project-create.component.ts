import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectsService } from '../projects.service';


@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent {
  projectForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      repo_url: ['']
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.projectForm.value;
    const projectData = {
      name: formValue.name,
      description: formValue.description || undefined,
      repo_url: formValue.repo_url || undefined
    };

    this.projectsService.createProject(projectData).subscribe({
      next: (project) => {
        this.loading = false;
        this.router.navigate(['/projects', project.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.detail || 'Failed to create project';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}
