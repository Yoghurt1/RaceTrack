import 'mocha'
import express from 'express'
import * as http from 'http'
import supertest from 'supertest'
import { configureNunjucks } from '../../src/nunjucks'
import { Controller } from '../../src/controllers/controller'
import { FrontendError } from '../../src/errors'

const app = express()

export const request = supertest(app)
export const router = express.Router()

configureNunjucks(app)

export function setupController<T extends Controller>(controller: T): T {
  controller.attachRoutes(router)

  return controller
}

export function resetRouter() {
  router.stack = []
}

app.use('/', router)

app.use(function(err: FrontendError, req: express.Request, res: express.Response) {
  res.status(err.status || 500)
  res.send()
})

const server = http.createServer(app)
server.listen()

after(function () {
  server.close()
})
