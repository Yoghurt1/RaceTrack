import express from 'express'
import { attachRoutes } from './routes'
import { configureNunjucks } from './nunjucks'
import { attachErrorHandling } from './middleware/errorHandling'
import * as path from 'path'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

configureNunjucks(app)

app.use('/public', express.static(path.join(__dirname, '../public')))
app.use(function (req, res, next) {
  res.locals.asset_path = '/public'

  next()
})

attachRoutes(app)
attachErrorHandling(app)

module.exports = app
