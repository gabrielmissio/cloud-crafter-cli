## DynamoDB Table

This CloudFormation stack creates an AWS DynamoDB table for storing user data with configurable read and write capacity.

The stack defines a condition, IsProdStack, which checks whether the StageName parameter is equal to 'prod'. If it is, the BillingMode for the DynamoDB table is set to PAY_PER_REQUEST, otherwise it is set to PROVISIONED.

### Create

```bash
aws cloudformation create-stack --stack-name dynamodb-table-dev --template-body file://dynamodb-table.yml --region us-east-1 --parameters ParameterKey=StageName,ParameterValue=dev
```

### Update

```bash
aws cloudformation update-stack --stack-name dynamodb-table-dev --template-body file://dynamodb-table.yml --region us-east-1 --parameters ParameterKey=StageName,ParameterValue=dev
```