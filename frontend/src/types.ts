export const TYPES = {
  // Static types
  Connection: 'Connection',
  Session: 'Session',
  SessionProvider: 'SessionProvider',
  TwitterClient: 'TwitterClient',

  // Services
  TimingService: Symbol.for('TimingService'),
  ApiClient: Symbol.for('ApiClient'),
  TwitterService: Symbol.for('TwitterService'),
  FileService: Symbol.for('FileService'),

  // Mappers
  AnalyseRequestMapper: Symbol.for('AnalyseRequestMapper'),
  ServiceMessageMapper: Symbol.for('ServiceMessageMapper'),
  ColSpecMapper: Symbol.for('ColSpecMapper'),
  ChartRequestMapper: Symbol.for('ChartRequestMapper'),

  // Controllers
  HomeController: Symbol.for('HomeController'),
  EventSentimentController: Symbol.for('EventSentimentController'),
  EventVisualisationController: Symbol.for('EventVisualisationController')
}
