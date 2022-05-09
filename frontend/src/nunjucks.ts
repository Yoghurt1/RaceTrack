import { Application } from 'express'
import * as path from 'path'
import * as nunjucks from 'nunjucks'

export function configureNunjucks(app: Application) {
  app.set('views', path.join(__dirname, '../views'))
  const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
  })

  app.set('view engine', 'html')
}