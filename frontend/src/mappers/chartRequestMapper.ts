import { injectable } from 'inversify'
import { ChartRequest } from '../interfaces/api/chartRequest'
import { VisualisationFormModel } from '../interfaces/visualisationFormModel'

@injectable()
export class ChartRequestMapper {
  public mapToRequest(uuid: string, form: VisualisationFormModel): ChartRequest {
    return {
      uuid: uuid,
      chartType: form.chartType,
      xAxis: form.xAxis,
      yAxis: form.yAxis,
      xFunction: form.xFunction,
      yFunction: form.yFunction,
      classCompare: form.classCompare !== 'Loading...' ? form.classCompare : null,
      carCompare1: form.carCompare1 !== 'Loading...' ? form.carCompare1 : null,
      carCompare2: form.carCompare2 !== 'Loading...' ? form.carCompare2 : null
    }
  }
}
