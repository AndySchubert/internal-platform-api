export interface Environment {
  id: string;
  project_id: string;
  name: string;
  type: 'ephemeral' | 'persistent';
  status: 'provisioning' | 'running' | 'failed';
  base_url?: string;
  created_at: string;
  expires_at?: string;
}

export interface EnvironmentCreate {
  name: string;
  type: 'ephemeral' | 'persistent';
  config?: Record<string, any>;
  ttl_hours?: number;
}
