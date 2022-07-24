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
import { DATA_DIR, TEST_UUID } from '../config'
import * as fs from 'fs'
import { ServiceMessageMapper } from '../mappers/serviceMessageMapper'
import { ServiceMessage } from '../interfaces/serviceMessage'

@injectable()
export class TimingService {
  private session!: Session
  private events: ServiceManifest[] = []

  public constructor(
    @inject(TYPES.SessionProvider) private sessionProvider: SessionProvider,
    @inject(TYPES.FileService) private fileService: FileService,
    @inject(TYPES.ApiClient) private client: ApiClient,
    @inject(TYPES.AnalyseRequestMapper) private analyseMapper: AnalyseRequestMapper,
    @inject(TYPES.ServiceMessageMapper) private messageMapper: ServiceMessageMapper
  ) {
    this.sessionProvider().then((res) => {
      this.session = res
      this.directorySubscriber()
    })
  }

  public getEvents(): ServiceManifest[] {
    return this.events
  }

  public getEvent(uuid: string): ServiceManifest {
    return this.events.find((manifest) => manifest.uuid === uuid)
  }

  public async connectEvent(manifest: ServiceManifest, dataFolder: string): Promise<void> {
    const handler = async (message: MessageWrapper<ServiceState>[]) => {
      const fileBuffer: string = JSON.stringify(this.mapToFileBuffer(message[0]))
      await this.fileService.saveFile(`${dataFolder}/${message[0].date}.json`, Buffer.from(fileBuffer))
    }

    await this.client.analyseEvent(this.analyseMapper.mapToAnalyseRequest(manifest))
    this.session.subscribe(`livetiming.service.${manifest.uuid}`, handler)
  }

  public async getRecentMessages(uuid: string): Promise<ServiceMessage[]> {
    const messages: (string | number)[][] = await this.client.getRecentMessages(uuid)
    return messages.map((message) => this.messageMapper.mapToServiceMessage(message))
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
        await this.client.stopAnalysisEvent(this.analyseMapper.mapToStopAnalysisRequest(event))
      })

      this.events = this.events.filter(
        currentEvent => newEvents.includes(currentEvent)
      ).concat(
        newEvents.filter(
          newEvent => !this.events.includes(newEvent)
        )
      ).concat( // Testing purposes
        [JSON.parse(fs.readFileSync(`${DATA_DIR}/${TEST_UUID}/manifest.json`).toString())]
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
