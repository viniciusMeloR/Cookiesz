output "s3_bucket_name" {

  description = "Nome do bucket do Maple Storage"

  value = aws_s3_bucket.maple_storage.bucket
}


output "s3_images_url" {

  description = "URL base para as imagens do Maple Storage"

  value = "https://${aws_s3_bucket.maple_storage.bucket}.s3.${data.aws_region.current.region}.amazonaws.com"
}

output "rds_endpoint" {
  description = "Endpoint do banco RDS"
  value       = aws_db_instance.rds_db.address
}