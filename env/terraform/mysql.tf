resource "google_sql_database_instance" "master" {
  name = "subreddit-sentiment-analysis"
  database_version = "MYSQL_5_6"
  region = "${local.region}"

  settings {
    tier = "db-f1-micro"
  }
}