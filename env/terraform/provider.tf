provider "google" {
  credentials = "${file("../terraform-credentials.json")}"
  project = "subreddit-sentiment-analysis"
  region = "europe-west2"
  zone = "${local.zone}"
}
