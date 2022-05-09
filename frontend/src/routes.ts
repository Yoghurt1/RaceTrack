import * as express from 'express'
import { Controller } from './controllers/controller'
import iocContainer from './ioc'
import { TYPES } from './types'

export function attachRoutes(app: express.Application): void {
  const controllers: Controller[] = [
    getController(TYPES.HomeController)
  ]

  const router = express.Router()
  app.use('/', router)

  for (const controller of controllers) {
    controller.attachRoutes(router)
  }
}

function getController(type: symbol): Controller {
  return iocContainer.get<Controller>(type)
}