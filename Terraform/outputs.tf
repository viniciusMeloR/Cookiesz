
output "rds_endpoint" {
  description = "Endpoint do banco RDS"
  value       = aws_db_instance.rds_db.address
}