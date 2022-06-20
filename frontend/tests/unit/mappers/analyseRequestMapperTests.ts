import 'mocha'
import { assert } from 'chai'
import { generateServiceManifest } from '../../fixtures/timingFixtures'
import { ServiceManifest } from '../../../src/interfaces/serviceManifest'
import { AnalyseRequestMapper } from '../../../src/mappers/analyseRequestMapper'
import { AnalyseRequest } from '../../../src/interfaces/api/analyseRequest'
import { StopAnalysisRequest } from '../../../src/interfaces/api/stopAnalysisRequest'

describe('AnalyseRequestMapper', () => {
  const mapper = new AnalyseRequestMapper()

  let manifest: ServiceManifest

  beforeEach(() => {
    manifest = generateServiceManifest()
  })

  it('should map manifest to analyse request', () => {
    const request: AnalyseRequest = mapper.mapToAnalyseRequest(manifest)

    assert.equal(request.uuid, manifest.uuid)
    assert.equal(request.query, manifest.serviceClass)
  })

  it('should map manifest to stop analysis request', () => {
    const request: StopAnalysisRequest = mapper.mapToStopAnalysisRequest(manifest)

    assert.equal(request.uuid, manifest.uuid)
  })
})
