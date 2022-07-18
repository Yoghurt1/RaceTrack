import { Application } from 'express'
import * as path from 'path'
import * as nunjucks from 'nunjucks'
import { asTime } from './filters'

export function configureNunjucks(app: Application) {
  app.set('views', path.join(__dirname, '../views'))
  const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
  })

  addFilters(env)

  app.set('view engine', 'html')
}

function addFilters(env: nunjucks.Environment) {
  env.addFilter('asTime', asTime)
}
