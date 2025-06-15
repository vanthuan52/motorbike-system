# Overview

This document covers the steps to start with Minio

# Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
  - [Steps](#steps)

## Steps

1. Set an alias to connect to Minio

```bash
mc alias set <ALIAS_NAME> <MINIO_ENDPOINT> <ACCESS_KEY> <SECRET_KEY>
```

Example

```bash
mc alias set motorbike-minio http://localhost:9000 MINIO_ROOT_USER MINIO_ROOT_PASSWORD
```

- Replace `http://localhost:9000` with your minio server endpoint.
- Replace `MINIO_ROOT_USER MINIO_ROOT_PASSWORD` with your root minio account
- For example: `mc alias set motorbike-minio http://localhost:9000 miniomotorbike changeme`

2. Create buckets (if not exist)

```bash
mc mb <ALIAS_NAME>/<bucket-name>
```

Example

```bash
mc mb motorbike-minio/motorbike-system-public-files
mc mb motorbike-minio/motorbike-system-private-files
```

3. Create user for each buckets (For securtiy purposes)

```bash
mc admin user add <ALIAS_NAME> <ACCESS_KEY> <SECRET_KEY>
```

You should save or remember the secret, you cannot see that when user is added. Example

```bash
mc admin user add motorbike-minio motorbike-public-user YOUR_PUBLIC_SECRET_KEY_HERE
mc admin user add motorbike-minio motorbike-private-user YOUR_PRIVATE_SECRET_KEY_HERE
```

4. Create policy files

You need to create a JSON file that contains the policy (in your project or a specified folder)

File: motorbike-public-app-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:AbortMultipartUpload"
      ],
      "Resource": [
        "arn:aws:s3:::motorbike-system-public-files",
        "arn:aws:s3:::motorbike-system-public-files/*"
      ]
    }
  ]
}
```

File: motorbike-private-app-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:AbortMultipartUpload"
      ],
      "Resource": [
        "arn:aws:s3:::motorbike-system-private-files",
        "arn:aws:s3:::motorbike-system-private-files/*"
      ]
    }
  ]
}
```

5. Add policies into MINIO and assign it to users

Use `mc admin policy create` to add policy from JSON file to MINIO, then use `mc admin policy attach` to assign that policy to the new user created.

```bash
mc admin policy create <ALIAS_NAME> <POLICY_NAME> <PATH_TO_POLICY_FILE.json>
mc admin policy attach <ALIAS> <POLICY_NAME> --user <USERNAME>
```

Example

```bash
# Public
mc admin policy create motorbike-minio motorbike-public-policy ./motorbike-public-app-policy.json

mc admin policy attach motorbike-minio motorbike-public-policy --user motorbike-public-user

# Private:
mc admin policy create motorbike-minio motorbike-private-policy ./motorbike-private-app-policy.json

mc admin policy attach motorbike-minio motorbike-private-policy --user motorbike-private-user
```

Example in the project

```bash
mc admin policy create motorbike-minio motorbike-public-policy ./minio/motorbike-public-app-policy.json
```

6. Update your .env file

```bash
# Environment setting
NODE_ENV=development

# MinIO Public (for Development/Staging)
MINIO_PUBLIC_CREDENTIAL_KEY=motorbike-public-user
MINIO_PUBLIC_CREDENTIAL_SECRET=YOUR_PUBLIC_SECRET_KEY_HERE
MINIO_PUBLIC_BUCKET=motorbike-system-public-files
MINIO_PUBLIC_ENDPOINT=http://localhost:9000

# MinIO Private (for Development/Staging)
MINIO_PRIVATE_CREDENTIAL_KEY=motorbike-private-user
MINIO_PRIVATE_CREDENTIAL_SECRET=YOUR_PRIVATE_SECRET_KEY_HERE
MINIO_PRIVATE_BUCKET=motorbike-system-private-files
MINIO_PRIVATE_ENDPOINT=http://localhost:9000
```

## Additional

1. Unasign user from policy

For user

```bash
mc admin policy detach <ALIAS> <POLICY_NAME> --user <USERNAME>
```

For Group

```bash
mc admin policy detach <ALIAS> <POLICY_NAME> --group <GROUPNAME>
```

2. Remove policy definition

```bash
mc admin policy remove <ALIAS> <POLICY_NAME>
```

3. Remove bucket policy

```bash
mc policy set-none <ALIAS>/<BUCKET_NAME>
```

## Command history

This is for authenticated users

```bash
mc admin policy create motorbike-minio motorbike-public-user-full-access-policy ./minio/public-user-full-access-policy.json

mc admin policy create motorbike-minio motorbike-private-user-full-access-policy ./minio/private-user-full-access-policy.json

mc admin policy attach motorbike-minio motorbike-public-user-full-access-policy --user motorbike-public-user

mc admin policy attach motorbike-minio motorbike-private-user-full-access-policy --user motorbike-private-user

```

This is for anonymous users

```bash
mc anonymous set-json ./minio/public-bucket-read-only-policy.json motorbike-minio/motorbike-system-public-files
```
