provider "google" {
  credentials = "${file("gcp-credentials.json")}"
  project = "subreddit-sentiment-analysis"
  region = "europe-west2"
  zone = "${local.zone}"
}
