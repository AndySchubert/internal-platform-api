import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Deployment, DeploymentCreate } from '../../shared/models/deployment.model';

@Injectable({
  providedIn: 'root'
})
export class DeploymentsService {
  private apiUrl = `${environment.apiUrl}/api/v1/deployments`;

  constructor(private http: HttpClient) {}

  getDeployments(environmentId: string): Observable<Deployment[]> {
    return this.http.get<Deployment[]>(`${this.apiUrl}/environments/${environmentId}`);
  }

  getDeployment(id: string): Observable<Deployment> {
    return this.http.get<Deployment>(`${this.apiUrl}/${id}`);
  }

  createDeployment(environmentId: string, deployment: DeploymentCreate): Observable<Deployment> {
    return this.http.post<Deployment>(`${this.apiUrl}/environments/${environmentId}`, deployment);
  }
}
