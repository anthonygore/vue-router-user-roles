const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const installation = fs
  .readFileSync('./gitbook/installation.md', 'utf-8')
  .replace(
    /https:\/\/unpkg\.com\/vue-router-user-roles@[\d.]+.[\d]+\/dist\/vue-router-user-roles\.js/,
    'https://unpkg.com/vue-router-user-roles@' + pack.version + '/dist/vue-router-user-roles.js.'
  )
fs.writeFileSync('./gitbook/installation.md', installation)
