import 'mocha'
import { assert } from 'chai'
import { instance, mock, when } from 'ts-mockito'
import { HomeController } from '../../../src/controllers/homeController'
import { TimingService } from '../../../src/services/timingService'
import { ApiClient } from '../../../src/services/apiClient'
import { request, setupController } from '../setup'
import { generateServiceManifest } from '../../fixtures/timingFixtures'
import { StatusCodes } from 'http-status-codes'

describe('HomeController', () => {
  let homeController: HomeController

  let timingService: TimingService
  let apiClient: ApiClient

  before(() => {
    timingService = mock(TimingService)
    apiClient = mock(ApiClient)
    
    homeController = setupController(
      new HomeController(
        instance(timingService),
        instance(apiClient)
      )
    )
  })

  describe('GET /', () => {
    it('should return homepage', async () => {
      when(apiClient.route()).thenResolve({ 'test': 'data' })
      when(timingService.getEvents()).thenReturn([generateServiceManifest()])

      const res = await request
        .get('/')
        .expect(StatusCodes.OK)

      assert.isNotEmpty(res)
    })
  })
})
