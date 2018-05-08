const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const installation = fs
  .readFileSync('./gitbook/installation.md', 'utf-8')
  .replace(
    /https:\/\/unpkg\.com\/vue-router-permissions@[\d.]+.[\d]+\/dist\/vue-router-permissions\.js/,
    'https://unpkg.com/vue-router-permissions@' + pack.version + '/dist/vue-router-permissions.js.'
  )
fs.writeFileSync('./gitbook/installation.md', installation)
