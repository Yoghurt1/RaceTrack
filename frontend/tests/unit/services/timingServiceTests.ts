import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, when, verify, anything } from 'ts-mockito'
import { TimingService } from '../../../src/services/timingService'
import { SessionProvider } from '../../../src/provider'
import { FileService } from '../../../src/services/fileService'
import { ApiClient } from '../../../src/services/apiClient'
import { AnalyseRequestMapper } from '../../../src/mappers/analyseRequestMapper'
import { generateMockSession, generateServiceManifest, generateServiceMessage, generateServiceMessageResponse, generateServiceStateMessage, generateSessionProvider } from '../../fixtures/timingFixtures'
import { ServiceManifest } from '../../../src/interfaces/serviceManifest'
import { generateAnalyseRequest } from '../../fixtures/apiFixtures'
import { AnalyseRequest } from '../../../src/interfaces/api/analyseRequest'
import { Session } from 'autobahn'
import { ServiceState } from '../../../src/interfaces/serviceState'
import { MessageWrapper } from '../../../src/interfaces/messageWrapper'
import { ServiceMessageMapper } from '../../../src/mappers/serviceMessageMapper'
import { TEST_UUID } from '../../../src/config'
import { ServiceMessage } from '../../../src/interfaces/serviceMessage'

describe('TimingService', () => {
  let timingService: TimingService

  let fileService: FileService
  let client: ApiClient
  let analyseMapper: AnalyseRequestMapper
  let messageMapper: ServiceMessageMapper

  const sessionStub: sinon.SinonStubbedInstance<Session> = generateMockSession()
  const sessionProvider: SessionProvider = generateSessionProvider(sessionStub)

  before(() => {
    fileService = mock(FileService)
    client = mock(ApiClient)
    analyseMapper = mock(AnalyseRequestMapper)
    messageMapper = mock(ServiceMessageMapper)

    timingService = new TimingService(
      sessionProvider,
      instance(fileService),
      instance(client),
      instance(analyseMapper),
      instance(messageMapper)
    )
  })

  describe('connectEvent', () => {
    it('should connect to an event, start analysis and save messages', async () => {
      const manifest: ServiceManifest = generateServiceManifest()
      const analyseRequest: AnalyseRequest = generateAnalyseRequest()
      const serviceState: MessageWrapper<ServiceState>[] = generateServiceStateMessage()
      const expectedFilePath = `/tmp/${manifest.uuid}/${serviceState[0].date}.json`

      when(analyseMapper.mapToAnalyseRequest(manifest)).thenReturn(analyseRequest)
      when(client.analyseEvent(analyseRequest)).thenResolve()
      when(fileService.saveFile(expectedFilePath, anything())).thenResolve()
      sessionStub.subscribe.callsArgWith(1, serviceState)

      await timingService.connectEvent(manifest, `/tmp/${manifest.uuid}`)

      verify(fileService.saveFile(expectedFilePath, anything())).called()
      verify(client.analyseEvent(analyseRequest)).once()
    })
  })

  describe('getMessages', () => {
    it('should fetch messages for given event', async () => {
      const serviceMessageResponse = generateServiceMessageResponse()
      const serviceMessage: ServiceMessage = generateServiceMessage()

      when(client.getRecentMessages(TEST_UUID)).thenResolve([serviceMessageResponse])
      when(messageMapper.mapToServiceMessage(serviceMessageResponse)).thenReturn(serviceMessage)

      const res: ServiceMessage[] = await timingService.getRecentMessages(TEST_UUID)

      assert.equal(res.length, 1)
      assert.deepEqual(res[0], serviceMessage)
    })
  })

  after(() => {
    sinon.restore()
  })
})
