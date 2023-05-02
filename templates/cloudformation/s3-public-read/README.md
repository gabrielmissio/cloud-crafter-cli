## S3 Public Read

This CloudFormation stack creates an Amazon S3 bucket with a public read for get objects policy.

### Create

```bash
aws cloudformation create-stack --stack-name s3-public-read-dev --template-body file://s3-public-read.yml --region us-east-1
```

### Update

```bash
aws cloudformation update-stack --stack-name s3-public-read-dev --template-body file://s3-public-read.yml --region us-east-1
```
