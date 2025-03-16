const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function quickstartJs (projectDir) {
  console.log('Setting up "quickstart-js" project...')

  // Run `npm init -y` if package.json does not exist
  const packageJsonPath = path.join(projectDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.log('Initializing package.json...')
    execSync('npm init -y', { cwd: projectDir, stdio: 'inherit' })
  }

  // Create `.gitignore` file
  const gitignorePath = path.join(projectDir, '.gitignore')
  fs.writeFileSync(gitignorePath, '.env\nnode_modules\n')
  console.log('Created .gitignore')

  // Install dependencies
  console.log('Installing dependencies...')
  execSync('npm install -D eslint globals @eslint/js lint-staged husky', {
    cwd: projectDir,
    stdio: 'inherit'
  })

  // Create eslint.config.mjs
  const eslintConfig =
`import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  { rules: {
    indent: ['error', 2],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'eol-last': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
  }},
]
`
  fs.writeFileSync(path.join(projectDir, 'eslint.config.mjs'), eslintConfig)
  console.log('Created eslint.config.mjs')

  // Add lint script to package.json
  execSync('npm pkg set scripts.lint="eslint"', { cwd: projectDir, stdio: 'inherit' })

  // Create `.lintstagedrc`
  const lintstagedrc =
`{
  "*.js": "npm run lint -- --fix",
  "*.mjs": "npm run lint -- --fix"
}`
  fs.writeFileSync(path.join(projectDir, '.lintstagedrc'), lintstagedrc)
  console.log('Created .lintstagedrc')

  // Initialize Husky
  console.log('Initializing Husky...')
  execSync('npx husky init', { cwd: projectDir, stdio: 'inherit' })

  // Create pre-commit hook
  fs.writeFileSync(path.join(projectDir, '.husky/pre-commit'), 'npx lint-staged\n', { mode: 0o755 })
  console.log('Created pre-commit hook')

  // Create pre-push hook
  fs.writeFileSync(
    path.join(projectDir, '.husky/pre-push'),
    `# uncomment after setting up test script
# npm run test
  
# remove this line after setting up test script
echo "test script not set up yet"\n`,
    { mode: 0o755 } // ensure file is executable (avoid permission denied error)
  )
  console.log('Created pre-push hook')
  console.log('✅ "quickstart-js" template setup completed successfully!')
}

module.exports = quickstartJs
