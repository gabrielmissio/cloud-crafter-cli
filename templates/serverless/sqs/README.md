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

or just invoke Main Queue Producer

```bash
sam local invoke MainQueueProducerLambdaFunction \
    --template-file sam.yml \
    --env-vars env.dev.json \
    --event main-queue-producer/events/demo.json
```

### Invoke Alert Topic Consumer

```bash
sam local invoke AlertTopicConsumerLambdaFunction \
    --template-file sam.yml --event alert-topic-consumer/events/demo.json
```

### Invoke Main Queue Consumer

```bash
sam local invoke MainQueueConsumerLambdaFunction \
    --template-file sam.yml \
    --env-vars env.${STAGE}.json \
    --event main-queue-consumer/events/demo.json
```

### Invoke Error Queue Consumer

```bash
sam local invoke ErrorQueueConsumerLambdaFunction \
    --template-file sam.yml \
    --env-vars env.${STAGE}.json \
    --event error-queue-consumer/events/demo.json
```

## Deploy

```bash
sam package --template-file sam.yml \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix sam/${APP_NAME}/${STAGE}/sam-package
```

```bash
sam deploy --template-file sam.yml \
    --stack-name ${APP_NAME}-Lambdas-${STAGE} \
    --s3-bucket ${DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix sam/${APP_NAME}/${STAGE}/sam-package \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides AppName=${APP_NAME} StageName=${STAGE}
```
