import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { DirectoryMessage } from '../interfaces/directoryMessage'
import { ServiceManifest } from '../interfaces/serviceManifest'
import { Session } from 'autobahn'
import { SessionProvider } from '../provider'

@injectable()
export class TimingService {
  private session!: Session
  private events: ServiceManifest[] = []

  public constructor(
    @inject(TYPES.SessionProvider) private sessionProvider: SessionProvider
  ) {
    this.sessionProvider().then((res) => {
      this.session = res
      this.eventSubscriber()
    })
  }

  public getEvents(): ServiceManifest[] {
    return this.events
  }

  private eventSubscriber() {
    const handler = (message: DirectoryMessage[]) => {
      console.log(JSON.stringify(message[0]))
      this.events = message[0].payload
    }
    
    this.session.subscribe('livetiming.directory', handler, { get_retained: true })
  }
}
