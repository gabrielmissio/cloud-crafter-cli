import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const snsClient = new SNSClient({
    AWS_REGION: process.env.AWS_REGION
})

export async function batchFailureAlert ({ context, totalRecords, failedRecords }) {
  if (process.env.AWS_SAM_LOCAL === "true") {
    return {
      message: 'Alert aborted: localhost detected.'
    }
  }
  
  const isTotalFailure = totalRecords === failedRecords
  
  const message = JSON.stringify({
    title: `Batch Failure Alert`,
    from: process.env.AWS_LAMBDA_FUNCTION_NAME,
    stage: process.env.STAGE,
    type: isTotalFailure ? 'error' : 'warning',
    subtitle: isTotalFailure ? 'TOTAL BATCH FAILURE' : 'PARTIAL BATCH FAILURE',
    message: `${failedRecords} of ${totalRecords} records failed to process`,
    potentialAction: [{
      '@type': 'OpenUri',
      name: 'Open Log on CloudWatch',
      targets: [{
        os: 'default',
        uri: getCloudWatchLogURL(context)
      }]
    }]
  })

  const result = await snsClient.send(
    new PublishCommand({
      Message: message,
      TopicArn: process.env.ALERT_TOPIC_ARN
    })
  )

  return result
}

// TODO: Refactor url builder
function getCloudWatchLogURL (context) {
  const basePath = `https://${process.env.AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${process.env.AWS_REGION}`
  const FilteredLogPath = `#logsV2:log-groups/log-group/${
        context.logGroupName.replace(/\//g, '$252F')
    }/log-events/${
        context.logStreamName
        .replace('$', '$2524')
        .replace('[', '$255B')
        .replace(']', '$255D')
        .replace(/\//g, '$252F')
    }$3FfilterPattern$3D$2522${
        context.awsRequestId
    }$2522`

  return `${basePath}${FilteredLogPath}`
}
