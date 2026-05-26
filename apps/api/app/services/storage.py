"""Storage service for document uploads"""

import boto3
from botocore.exceptions import ClientError
from app.config import settings

# Initialize S3 client
s3_client = None
if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )


async def upload_to_s3(file, key: str) -> str:
    """Upload file to S3 and return presigned URL"""
    
    if not s3_client:
        # Return mock URL for development
        return f"https://mock-storage.aquantica.dev/{key}"
    
    try:
        # Upload file
        s3_client.upload_fileobj(
            file.file,
            settings.AWS_BUCKET_NAME,
            key,
            ExtraArgs={"ContentType": file.content_type},
        )
        
        # Generate presigned URL
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.AWS_BUCKET_NAME, "Key": key},
            ExpiresIn=3600,
        )
        
        return url
        
    except ClientError as e:
        raise Exception(f"S3 upload failed: {str(e)}")


async def delete_from_s3(key: str):
    """Delete file from S3"""
    
    if not s3_client:
        return True
    
    try:
        s3_client.delete_object(
            Bucket=settings.AWS_BUCKET_NAME,
            Key=key,
        )
        return True
        
    except ClientError:
        return False
