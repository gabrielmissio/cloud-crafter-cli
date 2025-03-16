const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function quickstartJs (projectDir = process.cwd()) {
  console.log('Setting up "quickstart-js" project...')

  const packageJsonPath = path.join(projectDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.log('Initializing package.json...')
    execSync('npm init -y', { cwd: projectDir, stdio: 'inherit' })
  }

  const gitignorePath = path.join(projectDir, '.gitignore')
  if (!fs.existsSync(gitignorePath)) {
    console.log('Creating .gitignore...')
    fs.writeFileSync(gitignorePath, '.env\nnode_modules\n')
  }

  console.log('Installing dependencies...')
  execSync('npm install -D eslint globals @eslint/js lint-staged husky', {
    cwd: projectDir,
    stdio: 'inherit'
  })

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
  console.log('Creating eslint.config.mjs...')
  fs.writeFileSync(path.join(projectDir, 'eslint.config.mjs'), eslintConfig)

  console.log('Setting up lint script...')
  execSync('npm pkg set scripts.lint="eslint"', { cwd: projectDir, stdio: 'inherit' })

  const lintstagedrc =
`{
  "*.js": "npm run lint -- --fix",
  "*.mjs": "npm run lint -- --fix"
}`
  console.log('Creating .lintstagedrc')
  fs.writeFileSync(path.join(projectDir, '.lintstagedrc'), lintstagedrc)

  console.log('Initializing Husky...')
  execSync('npx husky init', { cwd: projectDir, stdio: 'inherit' })

  console.log('Creating pre-commit hook...')
  fs.writeFileSync(path.join(projectDir, '.husky/pre-commit'), 'npx lint-staged\n', { mode: 0o755 })

  console.log('Creating pre-push hook...')
  fs.writeFileSync(
    path.join(projectDir, '.husky/pre-push'),
    `# uncomment after setting up test script
# npm run test
  
# remove this line after setting up test script
echo "test script not set up yet"\n`,
    { mode: 0o755 } // ensure file is executable (avoid permission denied error)
  )

  console.log('✅ "quickstart-js" template setup completed successfully!')
}

module.exports = quickstartJs
