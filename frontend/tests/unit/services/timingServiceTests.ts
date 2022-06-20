import 'mocha'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import { TimingService } from '../../../src/services/timingService'
import { SessionProvider } from '../../../src/provider'
import { FileService } from '../../../src/services/fileService'
import { ApiClient } from '../../../src/services/apiClient'
import { AnalyseRequestMapper } from '../../../src/mappers/analyseRequestMapper'
import { generateMockSession, generateServiceManifest, generateServiceStateMessage, generateSessionProvider } from '../../fixtures/timingFixtures'
import { ServiceManifest } from '../../../src/interfaces/serviceManifest'
import { generateAnalyseRequest } from '../../fixtures/apiFixtures'
import { AnalyseRequest } from '../../../src/interfaces/api/analyseRequest'
import { Session } from 'autobahn'
import { ServiceState } from '../../../src/interfaces/serviceState'
import { MessageWrapper } from '../../../src/interfaces/messageWrapper'
import * as sinon from 'sinon'

describe('TimingService', () => {
  let timingService: TimingService

  let fileService: FileService
  let client: ApiClient
  let mapper: AnalyseRequestMapper

  const sessionStub: sinon.SinonStubbedInstance<Session> = generateMockSession()
  const sessionProvider: SessionProvider = generateSessionProvider(sessionStub)

  before(() => {
    fileService = mock(FileService)
    client = mock(ApiClient)
    mapper = mock(AnalyseRequestMapper)

    timingService = new TimingService(
      sessionProvider,
      instance(fileService),
      instance(client),
      instance(mapper)
    )
  })

  describe('connectEvent', () => {
    it('should connect to an event, start analysis and save messages', async () => {
      const manifest: ServiceManifest = generateServiceManifest()
      const analyseRequest: AnalyseRequest = generateAnalyseRequest()
      const serviceState: MessageWrapper<ServiceState>[] = generateServiceStateMessage()
      const expectedFilePath = `/tmp/${manifest.uuid}/${serviceState[0].date}.json`

      when(mapper.mapToAnalyseRequest(manifest)).thenReturn(analyseRequest)
      when(client.analyseEvent(analyseRequest)).thenResolve()
      when(fileService.saveFile(expectedFilePath, anything())).thenResolve()
      sessionStub.subscribe.callsArgWith(1, serviceState)

      await timingService.connectEvent(manifest, `/tmp/${manifest.uuid}`)

      verify(fileService.saveFile(expectedFilePath, anything())).called()
      verify(client.analyseEvent(analyseRequest)).once()
    })
  })

  after(() => {
    sinon.restore()
  })
})
