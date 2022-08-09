import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { HomeController } from './controllers/homeController'
import { TimingService } from './services/timingService'
import { Connection, Session } from 'autobahn'
import { SessionProvider, sessionProvider } from './provider'
import { ApiClient } from './services/apiClient'
import { API_HOST, API_PORT, TWITTER_API_TOKEN } from './config'
import { TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2'
import { TwitterService } from './services/twitterService'
import { FileService } from './services/fileService'
import { AnalyseRequestMapper } from './mappers/analyseRequestMapper'
import { EventSentimentController } from './controllers/eventSentimentController'
import { ServiceMessageMapper } from './mappers/serviceMessageMapper'
import { EventVisualisationController } from './controllers/eventVisualisationController'
import { ColSpecMapper } from './mappers/colSpecMapper'
import { ChartRequestMapper } from './mappers/chartRequestMapper'

const iocContainer = new Container()

// Timing service
iocContainer.bind<Connection>(TYPES.Connection).toConstantValue(new Connection({
  url: 'wss://relay-4.timing71.org/ws',
  realm: 'timing'
}))

iocContainer.bind<SessionProvider>(TYPES.SessionProvider).toProvider<Session>(sessionProvider)

// Twitter client
iocContainer.bind<TwitterApiReadOnly>(TYPES.TwitterClient).toConstantValue(new TwitterApi(TWITTER_API_TOKEN).readOnly)

// Services
iocContainer.bind<TimingService>(TYPES.TimingService).to(TimingService).inSingletonScope()
iocContainer.bind<ApiClient>(TYPES.ApiClient).toConstantValue(new ApiClient({ baseUrl: `${API_HOST}:${API_PORT}` }))
iocContainer.bind<TwitterService>(TYPES.TwitterService).to(TwitterService).inSingletonScope()
iocContainer.bind<FileService>(TYPES.FileService).to(FileService).inSingletonScope()

// Mappers
iocContainer.bind<AnalyseRequestMapper>(TYPES.AnalyseRequestMapper).to(AnalyseRequestMapper)
iocContainer.bind<ServiceMessageMapper>(TYPES.ServiceMessageMapper).to(ServiceMessageMapper)
iocContainer.bind<ColSpecMapper>(TYPES.ColSpecMapper).to(ColSpecMapper)
iocContainer.bind<ChartRequestMapper>(TYPES.ChartRequestMapper).to(ChartRequestMapper)

// Controllers
iocContainer.bind<HomeController>(TYPES.HomeController).to(HomeController)
iocContainer.bind<EventSentimentController>(TYPES.EventSentimentController).to(EventSentimentController)
iocContainer.bind<EventVisualisationController>(TYPES.EventVisualisationController).to(EventVisualisationController)

export default iocContainer
