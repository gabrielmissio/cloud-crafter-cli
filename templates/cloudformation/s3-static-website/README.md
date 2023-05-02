## S3 Static Website

This CloudFormation stack creates an Amazon S3 bucket for static website hosting.

### Create

```bash
aws cloudformation create-stack --stack-name s3-static-website-dev --template-body file://s3-static-website.yml --region us-east-1
```

### Update

```bash
aws cloudformation update-stack --stack-name s3-static-website-dev --template-body file://s3-static-website.yml --region us-east-1
```

### Deploy Website

```bash
aws s3 sync my-static-website s3://$WEB_SITE_BUCKET --delete --include '*'
```

Set "WEB_SITE_BUCKET" as an environment variable or replace "$WEB_SITE_BUCKET" with your bucket name
