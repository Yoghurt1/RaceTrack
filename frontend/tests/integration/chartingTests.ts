import 'mocha'
import { assert } from 'chai'
import { client } from './setup'
import { TEST_UUID } from '../../src/config'
import { ChartRequest } from '../../src/interfaces/api/chartRequest'
import { generateChartRequest } from '../fixtures/apiFixtures'
import { ChartResponse } from '../../src/interfaces/api/chartResponse'
import { ChartFunction } from '../../src/enums'

describe('API - Charting tests', () => {
  describe('GET /classes/{uuid}', () => {
    it('should return a list of classes for a given event', async () => {
      const res: string[] = await client.getClasses(TEST_UUID)

      assert.isTrue(res.length > 1)
      assert.include(res, 'TCR')
    })
  })

  describe('GET /car-numbers/{uuid}', () => {
    it('should return a list of car numbers for a given event', async () => {
      const res: string[] = await client.getCarNums(TEST_UUID)

      assert.isTrue(res.length > 1)
      assert.include(res, '1')
    })
  })

  describe('POST /chart', () => {
    let request: ChartRequest

    beforeEach(() => {
      request = generateChartRequest()
      request.uuid = TEST_UUID
    })

    it('should return data for requested chart', async () => {
      request.classCompare = 'TCR'
      request.yFunction = ChartFunction.average

      const res: ChartResponse[] = await client.getChartData(request)

      assert.isTrue(Object.keys(res).length > 1)
      assert.include(Object.keys(res), '66')
    })
  })
})
