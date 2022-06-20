import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ServiceManifest } from '../interfaces/serviceManifest'
import { Session } from 'autobahn'
import { SessionProvider } from '../provider'
import { FileService } from './fileService'
import { MessageWrapper } from '../interfaces/messageWrapper'
import { ServiceState } from '../interfaces/serviceState'
import { decompressFromUTF16 } from 'lz-string'
import { MessageWrapperArr } from '../interfaces/messageWrapperArr'
import { ServiceStateFile } from '../interfaces/serviceStateFile'
import { ApiClient } from './apiClient'
import { AnalyseRequestMapper } from '../mappers/analyseRequestMapper'
import { DATA_DIR } from '../config'

@injectable()
export class TimingService {
  private session!: Session
  private events: ServiceManifest[] = []

  public constructor(
    @inject(TYPES.SessionProvider) private sessionProvider: SessionProvider,
    @inject(TYPES.FileService) private fileService: FileService,
    @inject(TYPES.ApiClient) private client: ApiClient,
    @inject(TYPES.AnalyseRequestMapper) private mapper: AnalyseRequestMapper
  ) {
    this.sessionProvider().then((res) => {
      this.session = res
      this.directorySubscriber()
    })
  }

  public getEvents(): ServiceManifest[] {
    return this.events
  }

  public async connectEvent(manifest: ServiceManifest, dataFolder: string): Promise<void> {
    const handler = async (message: MessageWrapper<ServiceState>[]) => {
      console.log(message[0].date)
      const fileBuffer: string = JSON.stringify(this.mapToFileBuffer(message[0]))
      await this.fileService.saveFile(`${dataFolder}/${message[0].date}.json`, Buffer.from(fileBuffer))
    }

    await this.client.analyseEvent(this.mapper.mapToAnalyseRequest(manifest))
    this.session.subscribe(`livetiming.service.${manifest.uuid}`, handler)
  }

  private directorySubscriber() {
    const handler = (message: MessageWrapperArr<ServiceManifest>[]) => {
      const newEvents: ServiceManifest[] = message[0].payload
      const currentEventUuids: string[] = this.events.map(event => event.uuid)

      newEvents.forEach(async (manifest) => {
        if (!currentEventUuids.includes(manifest.uuid)) {
          const dataFolder = `${DATA_DIR}/${manifest.uuid}`

          this.fileService.createFolder(dataFolder)
          await this.connectEvent(manifest, dataFolder)
        }
      })

      const completedEvents: ServiceManifest[] = this.events.filter(currentEvent => !newEvents.includes(currentEvent))
      completedEvents.forEach(async (event) => {
        await this.client.stopAnalysisEvent(this.mapper.mapToStopAnalysisRequest(event))
      })

      this.events = this.events.filter(
        currentEvent => newEvents.includes(currentEvent)
      ).concat(
        newEvents.filter(
          newEvent => !this.events.includes(newEvent)
        )
      )
    }

    this.session.subscribe('livetiming.directory', handler, { get_retained: true })
  }

  private mapToFileBuffer(message: MessageWrapper<ServiceState>): ServiceStateFile {
    return {
      msgClass: message.msgClass,
      date: message.date,
      payload: decompressFromUTF16(JSON.stringify(message.payload)) || '{}'
    }
  }
}
