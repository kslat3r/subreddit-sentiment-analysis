resource "google_container_cluster" "subreddit-sentiment-analysis" {
  name = "subreddit-sentiment-analysis"
  zone = "${local.zone}"
  initial_node_count = "${local.initial_node_count}"
  
  node_config {
    machine_type = "${local.machine_type}"
    disk_size_gb = "${local.disk_size_gb}"
    oauth_scopes = "${local.oauth_scopes}"
  }
}

output "get-credentials-cmd" {
  value = "${local.get_credentials} ${google_container_cluster.subreddit-sentiment-analysis.id} --zone ${google_container_cluster.subreddit-sentiment-analysis.zone}"
}
