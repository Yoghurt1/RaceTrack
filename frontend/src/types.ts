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

  // Controllers
  HomeController: Symbol.for('HomeController')
}
