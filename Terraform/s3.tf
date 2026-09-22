data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

resource "aws_s3_bucket" "maple_storage" {

  bucket = "maple-storage-vinicius-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "Vinicius mapleStorage"
    Environment = "producao"
  }
}

resource "aws_s3_bucket_ownership_controls" "maple_storage" {

  bucket = aws_s3_bucket.maple_storage.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "maple_storage" {

  bucket = aws_s3_bucket.maple_storage.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


resource "aws_s3_bucket_policy" "maple_storage" {

  bucket = aws_s3_bucket.maple_storage.id

  depends_on = [
    aws_s3_bucket_public_access_block.maple_storage
  ]

  policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {
        Sid = "PublicReadImages"

        Effect = "Allow"

        Principal = "*"

        Action = "s3:GetObject"

        Resource = "${aws_s3_bucket.maple_storage.arn}/*"
      }

    ]
  })
}


resource "aws_s3_bucket_server_side_encryption_configuration" "maple_storage" {

  bucket = aws_s3_bucket.maple_storage.id

  rule {

    apply_server_side_encryption_by_default {

      sse_algorithm = "AES256"

    }
  }
}


locals {
  imagens = tolist(setunion(
    fileset("${path.module}/../public", "**/*.png"),
    fileset("${path.module}/../public", "**/*.jpg"),
    fileset("${path.module}/../public", "**/*.jpeg"),
    fileset("${path.module}/../public", "**/*.gif"),
    fileset("${path.module}/../public", "**/*.svg"),
    fileset("${path.module}/../public", "**/*.webp")
  ))
}


resource "aws_s3_object" "images" {

  for_each = toset(local.imagens)

  bucket = aws_s3_bucket.maple_storage.id

  key = each.value

  source = "${path.module}/../public/${each.value}"

  etag = filemd5(
    "${path.module}/../public/${each.value}"
  )

  content_type = lookup(

    {
      "png"  = "image/png"
      "jpg"  = "image/jpeg"
      "jpeg" = "image/jpeg"
      "gif"  = "image/gif"
      "svg"  = "image/svg+xml"
      "webp" = "image/webp"
    },

    lower(
      element(
        split(
          ".",
          each.value
        ),
        length(
          split(".", each.value)
        ) - 1
      )
    ),

    "application/octet-stream"
  )

}