import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { Project } from '../../../shared/models/project.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load projects';
        this.loading = false;
      }
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project? This will also delete all environments and deployments.')) {
      return;
    }

    this.projectsService.deleteProject(id).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to delete project.';
      }
    });
  }
}
