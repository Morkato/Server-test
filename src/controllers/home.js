const route = require('express').Router()
const path = require('path')

const drr = path.normalize(path.join(__dirname, '../', '../', 'public'))

route.get('/', (req, res) => res.render(path.join(drr, 'pages', 'Index.html')))

module.exports = route