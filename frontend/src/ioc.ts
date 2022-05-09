import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { HomeController } from './controllers/homeController'

const iocContainer = new Container()

iocContainer.bind<HomeController>(TYPES.HomeController).to(HomeController)

export default iocContainer