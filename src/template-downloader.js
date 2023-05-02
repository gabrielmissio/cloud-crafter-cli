const fetch = require('cross-fetch')
const fs = require('fs-extra')
const path = require('path')

const owner = 'gabrielmissio'
const repo = 'cloud-crafter-cli'

async function downloadTemplate (templatePath, targetPath) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/templates/${templatePath}`
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(`Unexpected response from GitHub API: ${JSON.stringify(data)}`)
  }

  if (Array.isArray(data)) {
    // If the response is an array, it means we received a directory
    await Promise.all(data.map(async (item) => {
      if (item.type === 'file') {
        const fileContentRes = await fetch(item.download_url)
        const fileContent = await fileContentRes.text()
        const fullPath = path.join(targetPath, item.name)
        await fs.outputFile(fullPath, fileContent)
        console.log(`Downloaded ${item.name} to ${fullPath}`)
      } else if (item.type === 'dir') {
        const newTargetPath = path.join(targetPath, item.name)
        await fs.ensureDir(newTargetPath)
        await downloadTemplate(`${templatePath}/${item.name}`, newTargetPath)
      } else {
        console.error(`Unexpected item type: ${item.type}`)
      }
    }))
  } else if (data.type === 'file') {
    // If the response is a file, it means we received a file
    const fileContentRes = await fetch(data.download_url)
    const fileContent = await fileContentRes.text()
    const fullPath = path.join(targetPath, data.name)
    await fs.outputFile(fullPath, fileContent)
    console.log(`Downloaded ${data.name} to ${fullPath}`)
  } else {
    // If the response is anything else, it means we received something unexpected
    console.error(`Unexpected response from GitHub API: ${JSON.stringify(data)}`)
  }
}

module.exports = { downloadTemplate }
