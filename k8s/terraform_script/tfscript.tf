terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.5.0"
    }
  }
}

provider "google" {
  credentials = file("./service_account_key.json")
  project     = "k8s-b00936909"
  region      = "us-central1-a"
}

resource "google_container_cluster" "cluster" {
  name               = "k8s-cluster-b00936909"
  location           = "us-central1-c"
  initial_node_count = 1
  node_config {
    machine_type = "e2-micro"
    disk_type    = "pd-standard"
    disk_size_gb = 10
    image_type   = "COS_CONTAINERD"
  }
}

output "cluster_endpoint" {
  value = google_container_cluster.cluster.endpoint
}