export interface Project {
  id: string;
  name: string;
  description?: string;
  repo_url?: string;
  created_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  repo_url?: string;
}
