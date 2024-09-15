## S3 Static Website

This CloudFormation stack creates an Amazon S3 bucket for static website hosting.

## Pre-Requisites

 - [AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-install.html)

## Set Envs

```bash
export STAGE=dev
export REGION=us-east-1
export APP_NAME=MyStaticWebsite
```

### Create

```bash
aws cloudformation create-stack --stack-name ${APP_NAME}-${STAGE} --template-body file://s3-static-website-v2.yml --region ${REGION}
```

### Update

```bash
aws cloudformation update-stack --stack-name ${APP_NAME}-${STAGE} --template-body file://s3-static-website-v2.yml --region ${REGION}
```

### Deploy Website

```bash
aws s3 sync my-static-website s3://$WEB_SITE_BUCKET --delete --include '*'
```

Set "WEB_SITE_BUCKET" as an environment variable or replace "$WEB_SITE_BUCKET" with your bucket name

### Clean up

```bash
aws cloudformation delete-stack --stack-name ${APP_NAME}-${STAGE} --region ${REGION}
```