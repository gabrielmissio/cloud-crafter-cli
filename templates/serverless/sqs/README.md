# Serverless SQS Demo

 - [Node.js](https://nodejs.org/en)
 - [AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-install.html)
 - [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)


## Set Envs

```bash
export STAGE=dev
export REGION=us-east-1
export APP_NAME=MyServerlessApp
export DEPLOYMENT_BUCKET_NAME="general-purpose-deployment-bucket"
```

## Localhost

### Start Local HTTP Server

```bash
sam local start-api --template-file sam.yml
```

## Deploy

```bash
mkdir -p .serverless
sam package --template-file sam.yml \
    --output-template-file .serverless/sam-package.yml \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix sam/${APP_NAME}/${STAGE}/sam-package
```

```bash
npm i --omit=dev
cd ../../tools/stacks/backend
sam deploy --template-file lambda-functions.yml \
    --stack-name ${APP_NAME}-Lambdas-${STAGE} \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix sam/${APP_NAME}/${STAGE}/lambda-functions \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides AppName=${APP_NAME} StageName=${STAGE}
```
