#!/usr/bin/env node

const Readline = require('readline')
const { Command } = require('commander')
const { exec } = require('child_process')

const { downloadTemplate } = require('./template-downloader')
const { isTemplateAllowed, getAllowedTemplates } = require('./template-whitelist-validator')

const program = new Command()

program
  .command('create <templateName> <targetPath>')
  .description('Create a new project from a template')
  .action((templateName, targetPath) => {
    if (!isTemplateAllowed(templateName)) {
      const availableTemplates = getAllowedTemplates().join(',')
      console.error(`Unknown template "${templateName}". The available templates are: ${availableTemplates}`)
      return
    }

    const newProjectDir = `./${targetPath}`
    console.log(`Creating new project from template '${templateName}' in '${newProjectDir}'`)

    downloadTemplate(templateName, newProjectDir).then(() => {
      if (templateName.startsWith('serverless/')) {
        const rl = Readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })

        // Prompt the user to confirm running npm install
        rl.question('Do you want to install dependencies? (y/n) ', (answer) => {
          rl.close()
          if (answer === 'y' || answer === 'Y') {
            const npmInstall = exec('npm install', { cwd: newProjectDir })
            npmInstall.stdout.pipe(process.stdout)

            npmInstall.on('close', () => {
              console.log('Project created successfully!')
            })
          } else {
            console.log('Project created successfully! To install dependencies, run \'npm install\' in the project directory.')
          }
        })
      } else {
        console.log('Project created successfully!')
      }
    })
  })

program.on('command:*', () => {
  console.error('Invalid command: %s', program.args.join(' '))
  process.exit(1)
})

program.parse(process.argv)
