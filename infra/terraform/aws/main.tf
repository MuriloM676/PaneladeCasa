terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

# VPC padrão e subnets (para DEV)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids
  tags = {
    Project = var.project_name
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "RDS access"
  vpc_id      = data.aws_vpc.default.id

  dynamic "ingress" {
    for_each = var.allowed_cidr_blocks
    content {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
      description = "Postgres ingress"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project = var.project_name
  }
}

resource "random_password" "db_password" {
  length  = 20
  special = true
}

resource "aws_db_instance" "postgres" {
  identifier              = "${var.project_name}-postgres"
  engine                  = "postgres"
  engine_version          = var.postgres_engine_version
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  db_name                 = var.postgres_db_name
  username                = var.postgres_username
  password                = var.postgres_password != "" ? var.postgres_password : random_password.db_password.result
  publicly_accessible     = var.rds_publicly_accessible
  vpc_security_group_ids  = [aws_security_group.rds.id]
  db_subnet_group_name    = aws_db_subnet_group.this.name
  skip_final_snapshot     = var.skip_final_snapshot
  backup_retention_period = var.backup_retention_days
  deletion_protection     = var.deletion_protection

  tags = {
    Project = var.project_name
  }
}

# S3 para uploads (opcional)
resource "random_string" "bucket_suffix" {
  length  = 6
  upper   = false
  numeric = true
  special = false
}

resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.project_name}-uploads-${random_string.bucket_suffix.result}"
  force_destroy = var.s3_force_destroy

  tags = {
    Project = var.project_name
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
