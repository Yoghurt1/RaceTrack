import express from 'express'
import { attachRoutes } from './routes'
import { configureNunjucks } from './nunjucks'
import { attachErrorHandling } from './middleware/errorHandling'

const app = express()

configureNunjucks(app)
attachRoutes(app)
attachErrorHandling(app)

module.exports = app
