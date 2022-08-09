import 'mocha'
import { assert } from 'chai'
import { ChartRequestMapper } from '../../../src/mappers/chartRequestMapper'
import { VisualisationFormModel } from '../../../src/interfaces/visualisationFormModel'
import { generateVisualisationFormModel } from '../../fixtures/apiFixtures'
import { ChartRequest } from '../../../src/interfaces/api/chartRequest'
import { TEST_UUID } from '../../../src/config'
import { ChartFunction } from '../../../src/enums'

describe('ChartRequestMapper', () => {
  const mapper = new ChartRequestMapper()

  let form: VisualisationFormModel

  beforeEach(() => {
    form = generateVisualisationFormModel()
  })

  it('should map mandatory fields to request', () => {
    const request: ChartRequest = mapper.mapToRequest(TEST_UUID, form)

    assert.equal(request.uuid, TEST_UUID)
    assert.equal(request.chartType, form.chartType)
    assert.equal(request.xAxis, form.xAxis)
    assert.equal(request.yAxis, form.yAxis)
    assert.isUndefined(request.xFunction)
    assert.isUndefined(request.yFunction)
    assert.isUndefined(request.classCompare)
    assert.isUndefined(request.carCompare1)
    assert.isUndefined(request.carCompare2)
  })

  it('should map optional fields to request if present', () => {
    form.xFunction = ChartFunction.average
    form.yFunction = ChartFunction.average
    form.classCompare = 'some class'
    form.carCompare1 = 'some car'
    form.carCompare2 = 'some other car'

    const request: ChartRequest = mapper.mapToRequest(TEST_UUID, form)

    assert.equal(request.uuid, TEST_UUID)
    assert.equal(request.chartType, form.chartType)
    assert.equal(request.xAxis, form.xAxis)
    assert.equal(request.yAxis, form.yAxis)
    assert.equal(request.xFunction, form.xFunction)
    assert.equal(request.yFunction, form.yFunction)
    assert.equal(request.classCompare, form.classCompare)
    assert.equal(request.carCompare1, form.carCompare1)
    assert.equal(request.carCompare2, form.carCompare2)
  })
})
