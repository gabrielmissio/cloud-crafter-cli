const ALLOWED_TEMPLATES = [
  'serverless/s3',
  'serverless/http',
  'cloudformation/dynamodb-table',
  'cloudformation/s3-public-read',
  'cloudformation/s3-static-website',
  'utils/fast-setup'
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
