import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { HomeController } from './controllers/homeController'
import { TimingService } from './services/timingService'
import { Connection, Session } from 'autobahn'
import { SessionProvider, sessionProvider } from './provider'

const iocContainer = new Container()

iocContainer.bind<Connection>(TYPES.Connection).toConstantValue(new Connection({
  url: 'wss://relay-4.timing71.org/ws',
  realm: 'timing'
}))

iocContainer.bind<SessionProvider>(TYPES.SessionProvider).toProvider<Session>(sessionProvider)

// Services
iocContainer.bind<TimingService>(TYPES.TimingService).to(TimingService).inSingletonScope()

// Controllers
iocContainer.bind<HomeController>(TYPES.HomeController).to(HomeController)

export default iocContainer
