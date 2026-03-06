import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/new',
    loadComponent: () => import('./features/projects/project-create/project-create.component').then(m => m.ProjectCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId/environments',
    loadComponent: () => import('./features/environments/environment-list/environment-list.component').then(m => m.EnvironmentListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId/environments/new',
    loadComponent: () => import('./features/environments/environment-create/environment-create.component').then(m => m.EnvironmentCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'environments/:envId/deployments',
    loadComponent: () => import('./features/deployments/deployment-list/deployment-list.component').then(m => m.DeploymentListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'environments/:envId/deployments/new',
    loadComponent: () => import('./features/deployments/deployment-create/deployment-create.component').then(m => m.DeploymentCreateComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/projects'
  }
];
