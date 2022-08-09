import 'mocha'
import { assert } from 'chai'
import { ServiceMessageMapper } from '../../../src/mappers/serviceMessageMapper'
import { generateServiceMessageResponse } from '../../fixtures/timingFixtures'

describe('ServiceMessageMapper', () => {
  const mapper = new ServiceMessageMapper()

  let serviceMessage: (string | number)[]

  beforeEach(() => {
    serviceMessage = generateServiceMessageResponse()
  })

  it('should map a service message from API to service message interface', () => {
    const res = mapper.mapToServiceMessage(serviceMessage)

    assert.equal(res.timestamp, serviceMessage[0])
    assert.equal(res.category, serviceMessage[1])
    assert.equal(res.message, serviceMessage[2])
    assert.equal(res.messageType, serviceMessage[3])
    assert.equal(res.carNumber, serviceMessage[4])
  })

  it('should not map car number if not present', () => {
    serviceMessage = serviceMessage.slice(0, 3)

    const res = mapper.mapToServiceMessage(serviceMessage)

    assert.equal(res.timestamp, serviceMessage[0])
    assert.equal(res.category, serviceMessage[1])
    assert.equal(res.message, serviceMessage[2])
    assert.equal(res.messageType, serviceMessage[3])
    assert.isUndefined(res.carNumber)
  })
})
