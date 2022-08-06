import 'mocha'
import { assert } from 'chai'
import { TimingService } from '../../../src/services/timingService'
import { ColSpecMapper } from '../../../src/mappers/colSpecMapper'
import { ChartRequestMapper } from '../../../src/mappers/chartRequestMapper'
import { ApiClient } from '../../../src/services/apiClient'
import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { request, setupController } from '../setup'
import { EventVisualisationController } from '../../../src/controllers/eventVisualisationController'
import { TEST_UUID } from '../../../src/config'
import { StatusCodes } from 'http-status-codes'
import { ServiceManifest } from '../../../src/interfaces/serviceManifest'
import { generateColSpec, generateServiceManifest } from '../../fixtures/timingFixtures'
import { ColSpec } from '../../../src/interfaces/colSpec'
import { generateChartRequest, generateChartResponse } from '../../fixtures/apiFixtures'
import { ChartRequest } from '../../../src/interfaces/api/chartRequest'
import { ChartResponse } from '../../../src/interfaces/api/chartResponse'

describe('EventVisualisationControllerTests', () => {

  let timingSerivce: TimingService
  let colSpecMapper: ColSpecMapper
  let chartRequestMapper: ChartRequestMapper
  let client: ApiClient

  before(() => {
    timingSerivce = mock(TimingService)
    colSpecMapper = mock(ColSpecMapper)
    chartRequestMapper = mock(ChartRequestMapper)
    client = mock(ApiClient)

    setupController(new EventVisualisationController(
      instance(timingSerivce),
      instance(colSpecMapper),
      instance(chartRequestMapper),
      instance(client)
    ))
  })

  describe('GET /{uuid}/visualise', () => {
    const manifest: ServiceManifest = generateServiceManifest()
    const colSpec: ColSpec[] = generateColSpec()

    before(() => {
      when(timingSerivce.getEvent(anyString())).thenReturn(manifest)
      when(colSpecMapper.mapToColSpec(manifest.colSpec)).thenReturn(colSpec)
    })

    it('should return event visualisation page', async () => {
      await request
        .get(`/${TEST_UUID}/visualise`)
        .expect(StatusCodes.OK)
    })
  })

  describe('POST /{uuid}/visualise', () => {
    const apiRequest: ChartRequest = generateChartRequest()
    const response: ChartResponse[] = generateChartResponse()

    before(() => {
      when(chartRequestMapper.mapToRequest(TEST_UUID, anything())).thenReturn(apiRequest)
      when(client.getChartData(apiRequest)).thenResolve(response)
    })

    it('should return requested chart data', async () => {
      const res = await request
        .post(`/${TEST_UUID}/visualise`)
        .expect(StatusCodes.OK)

      assert.deepEqual(res.body, response)
    })
  })
})
