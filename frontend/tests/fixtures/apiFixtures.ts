import { ChartType } from '../../src/enums'
import { AnalyseRequest } from '../../src/interfaces/api/analyseRequest'
import { ChartRequest } from '../../src/interfaces/api/chartRequest'
import { ChartResponse } from '../../src/interfaces/api/chartResponse'
import { SentimentResponse } from '../../src/interfaces/api/sentimentResponse'
import { StopAnalysisRequest } from '../../src/interfaces/api/stopAnalysisRequest'
import { VisualisationFormModel } from '../../src/interfaces/visualisationFormModel'

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

export function generateVisualisationFormModel(): VisualisationFormModel {
  return {
    chartType: ChartType.column,
    xAxis: 'Laps',
    yAxis: 'Gap'
  }
}

export function generateChartRequest(): ChartRequest {
  return {
    uuid: '1482988259e745d3b96411bc7e36cabc',
    chartType: ChartType.column,
    xAxis: 'Laps',
    yAxis: 'Gap'
  }
}

export function generateChartResponse(): ChartResponse[] {
  return [
    { x: '1', y: '0.548' }
  ]
}
