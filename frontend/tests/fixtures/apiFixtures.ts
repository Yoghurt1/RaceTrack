import { AnalyseRequest } from '../../src/interfaces/api/analyseRequest'
import { StopAnalysisRequest } from '../../src/interfaces/api/stopAnalysisRequest'

export function generateAnalyseRequest(): AnalyseRequest {
  return {
    uuid: '1482988259e745d3b96411bc7e36cabc',
    query: 'testQuery'
  }
}

export function generateStopAnalysisRequest(): StopAnalysisRequest {
  return {
    uuid: '1482988259e745d3b96411bc7e36cabc'
  }
}
