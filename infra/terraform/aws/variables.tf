variable "project_name" {
  type        = string
  default     = "paneladecasadev"
  description = "Nome base para tags e recursos"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "allowed_cidr_blocks" {
  type        = list(string)
  default     = ["0.0.0.0/0"]
  description = "CIDRs com acesso ao Postgres (altere para o seu IP ou SGs em prod)"
}

variable "postgres_engine_version" {
  type    = string
  default = "15.5"
}

variable "rds_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "rds_allocated_storage" {
  type    = number
  default = 20
}

variable "postgres_username" {
  type    = string
  default = "app_user"
}

variable "postgres_password" {
  type      = string
  default   = ""
  sensitive = true
}

variable "postgres_db_name" {
  type    = string
  default = "appdb"
}

variable "rds_publicly_accessible" {
  type    = bool
  default = true
}

variable "skip_final_snapshot" {
  type    = bool
  default = true
}

variable "backup_retention_days" {
  type    = number
  default = 0
}

variable "deletion_protection" {
  type    = bool
  default = false
}

variable "s3_force_destroy" {
  type    = bool
  default = true
}
