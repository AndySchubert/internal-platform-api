variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "GCP Region"
}

variable "image_tag" {
  type        = string
  default     = "latest"
  description = "Docker image tag"
}

variable "database_url" {
  type        = string
  description = "Database connection URL (sensitive)"
  sensitive   = true
}

variable "artifact_repo_id" {
  type        = string
  description = "Artifact Registry repository ID (name)"
  default     = "internal-platform-api-eu"
}