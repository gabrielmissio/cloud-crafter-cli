const ALLOWED_TEMPLATES = [
  'sam/sqs',
  'sam/http',
  'sam/http-express',
  'sam/http-express-esbuild',
  'serverless/s3',
  'serverless/http',
  'serverless/rest',
  'cloudformation/dynamodb-table',
  'cloudformation/s3-public-read',
  'cloudformation/s3-static-website',
  'cloudformation/s3-static-website-v2',
  'utils/openai'
]

function isTemplateAllowed (template) {
  return ALLOWED_TEMPLATES.includes(template)
}

function getAllowedTemplates () {
  return [...ALLOWED_TEMPLATES]
}

module.exports = {
  isTemplateAllowed,
  getAllowedTemplates
}
