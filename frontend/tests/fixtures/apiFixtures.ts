import { AnalyseRequest } from '../../src/interfaces/api/analyseRequest'
import { SentimentResponse } from '../../src/interfaces/api/sentimentResponse'
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

export function generateSentimentResponse(): SentimentResponse[] {
  return [
    {
      sentiment: 1,
      time: new Date().toISOString()
    }
  ]
}

export function generateSentimentCsv(): string {
  return `\n1, ${Date.now() / 1000}`
}
