terraform {
  backend "gcs" {
    bucket  = "internal-platform-api-tf-state"
    prefix  = "terraform/state"
  }
}
