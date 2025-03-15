# CloudCrafter CLI

CloudCrafter CLI is a command-line interface tool that provides templates for common cloud resources to help you get started quickly.

## Installation

You can install CloudCrafter CLI globally using npm:

```bash
npm install -g cloud-crafter-cli
```

Alternatively, you can use npx to run the CLI without installing it globally:

```bash
npx cloud-crafter-cli create <template-name> <project-name>
```

## Usage

To create a new project using a template, run the following command:

```bash
cloud-crafter-cli create <template-name> <project-name>
```

or use the alias `ccc`

```bash
ccc create <template-name> <project-name>
```

For example, to create a new Serverless Framework HTTP service, you can run:

```bash
ccc create serverless/http my-new-project
```

## Available Templates

### AWS SAM

- sam/sqs  (Standard Queues)
- sam/http (API Gateway V2)

### Serverless Framework

- serverless/http (API Gateway V2)
- serverless/rest (API Gateway V1)
- serverless/s3   (S3 trigger)

### CloudFormation

- cloudformation/dynamodb-table
- cloudformation/s3-public-read
- cloudformation/s3-static-website

### Utils

 - utils/fast-setup
 - utils/openai
 
## Contributing

If you'd like to contribute to CloudCrafter CLI, please fork the repository and create a pull request.

## License

This repository is licensed under the MIT License. See the LICENSE file for more information.
