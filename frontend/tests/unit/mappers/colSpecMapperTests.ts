import 'mocha'
import { assert } from 'chai'
import { ColSpecMapper } from '../../../src/mappers/colSpecMapper'

describe('ColSpecMapper', () => {
  const mapper = new ColSpecMapper()

  let colSpecString: string[][]

  it('should map each array to ColSpec', () => {
    colSpecString = [['Num', 'text']]

    const result = mapper.mapToColSpec(colSpecString)

    assert.equal(result.length, 1)
    assert.equal(result[0].name, 'Num')
    assert.equal(result[0].dtype, 'text')
    assert.isUndefined(result[0].description)
  })

  it('should map description if present', () => {
    colSpecString = [['Num', 'text', 'Car number']]

    const result = mapper.mapToColSpec(colSpecString)

    assert.equal(result.length, 1)
    assert.equal(result[0].name, 'Num')
    assert.equal(result[0].dtype, 'text')
    assert.equal(result[0].description, 'Car number')
  })
})
