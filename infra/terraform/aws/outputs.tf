output "database_host" {
  value = aws_db_instance.postgres.address
}

output "database_port" {
  value = aws_db_instance.postgres.port
}

output "database_name" {
  value = aws_db_instance.postgres.db_name
}

output "database_username" {
  value     = aws_db_instance.postgres.username
  sensitive = true
}

output "database_password" {
  value     = aws_db_instance.postgres.password
  sensitive = true
}

output "database_url" {
  value     = "postgresql://${aws_db_instance.postgres.username}:${aws_db_instance.postgres.password}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${aws_db_instance.postgres.db_name}?schema=public"
  sensitive = true
}

output "s3_bucket_name" {
  value = aws_s3_bucket.uploads.bucket
}
