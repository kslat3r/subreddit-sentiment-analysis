
data "google_container_registry_repository" "subreddit-sentiment-analysis" {}

output "gcr_location" {
    value = "${data.google_container_registry_repository.subreddit-sentiment-analysis.repository_url}"
}