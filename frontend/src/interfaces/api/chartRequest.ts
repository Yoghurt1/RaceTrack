import { ChartFunction, ChartType } from '../../enums'

export interface ChartRequest {
  uuid: string
  chartType: ChartType
  xAxis: string
  yAxis: string
  xFunction?: ChartFunction
  yFunction?: ChartFunction
  classCompare?: string
  carCompare1?: string
  carCompare2?: string
}
