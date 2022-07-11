import 'mocha'
import { assert } from 'chai'
import { client } from './setup'
import { AnalyseRequest } from '../../src/interfaces/api/analyseRequest'
import { generateAnalyseRequest, generateStopAnalysisRequest } from '../fixtures/apiFixtures'
import { StopAnalysisRequest } from '../../src/interfaces/api/stopAnalysisRequest'

describe('API - Analyse tests', () => {
  describe('POST /analyse', () => {
    let request: AnalyseRequest

    beforeEach(() => {
      request = generateAnalyseRequest()
    })

    it('should return OK if valid request sent and begin analysing', async () => {
      await client.analyseEvent(request)

      after(async () => {
        await client.stopAnalysisEvent(generateStopAnalysisRequest())
      })
    })

    it('should return error if invalid UUID sent', async () => {
      request.uuid = 'invalid uuid'

      try {
        await client.analyseEvent(request)
        assert.fail()
      } catch (err) {
        assert.equal(err['status'], 400)
      }
    })

    it('should return error if no UUID sent', async () => {
      request.uuid = null

      try {
        await client.analyseEvent(request)
        assert.fail()
      } catch (err) {
        assert.equal(err['status'], 400)
      }
    })

    it('should return error if no query sent', async () => {
      request.query = null

      try {
        await client.analyseEvent(request)
        assert.fail()
      } catch (err) {
        assert.equal(err['status'], 400)
      }
    })
  })

  describe('POST /stop-analysis', () => {
    let request: StopAnalysisRequest

    beforeEach(() => {
      request = generateStopAnalysisRequest()
    })

    it('should return OK if valid request sent and begin analysing', async () => {
      await client.stopAnalysisEvent(request)
    })

    it('should return error if invalid UUID sent', async () => {
      request.uuid = 'invalid uuid'

      try {
        await client.stopAnalysisEvent(request)
        assert.fail()
      } catch (err) {
        assert.equal(err['status'], 400)
      }
    })

    it('should return error if no UUID sent', async () => {
      request.uuid = null

      try {
        await client.stopAnalysisEvent(request)
        assert.fail()
      } catch (err) {
        assert.equal(err['status'], 400)
      }
    })
  })
})
