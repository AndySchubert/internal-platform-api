terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.artifact_repo_id
  format        = "DOCKER"
  description   = "Repo for internal-platform-api images"

  lifecycle {
    prevent_destroy = true
  }
}

import {
  to = google_artifact_registry_repository.repo
  id = "projects/internal-platform-api/locations/europe-west1/repositories/internal-platform-api-eu"
}

# Cloud Run service
resource "google_cloud_run_v2_service" "api" {
  name     = "internal-platform-api"
  location = var.region

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}/internal-platform-api:${var.image_tag}"
      ports {
        container_port = 8000  # Adjust if your Uvicorn port is different (common for FastAPI)
      }
      env {
        name  = "DATABASE_URL"  # Example env var for your DB (add more as needed)
        value = var.database_url
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Make Cloud Run public (adjust IAM for auth if needed)
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.api.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "cloud_run_url" {
  value = google_cloud_run_v2_service.api.uri
}