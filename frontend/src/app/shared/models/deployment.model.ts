export interface Deployment {
  id: string;
  environment_id: string;
  version: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  logs_url?: string;
  created_at: string;
}

export interface DeploymentCreate {
  version: string;
}
