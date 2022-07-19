import { LivetimingVersion } from '../../src/interfaces/livetimingVersion'
import { ServiceManifest } from '../../src/interfaces/serviceManifest'
import { SessionProvider } from '../../src/provider'
import * as sinon from 'sinon'
import { Session } from 'autobahn'
import { MessageWrapper } from '../../src/interfaces/messageWrapper'
import { ServiceState } from '../../src/interfaces/serviceState'
import { MessageClass } from '../../src/enums'
import { ServiceMessage } from '../../src/interfaces/serviceMessage'

export function generateServiceManifest(): ServiceManifest {
  return {
    colSpec: generateColSpec(),
    description: 'some description',
    name: 'some name',
    livetimingVersion: generateLivetimingVersion(),
    pollInterval: 1,
    serviceClass: 'someservice',
    source: ['Some Source', 'https://www.source.com'],
    trackDataSpec: [],
    uuid: '1482988259e745d3b96411bc7e36cabc'
  }
}

export function generateColSpec(): string[][] {
  return [[]]
}

export function generateLivetimingVersion(): LivetimingVersion {
  return {
    core: '2022.1.0',
    plugin: '0.1.0'
  }
}

export function generateServiceMessage(): ServiceMessage {
  return {
    timestamp: Date.now(),
    category: 'GT3',
    message: 'some message',
    messageType: null,
    carNumber: '1'
  }
}

export function generateServiceState(): ServiceState {
  return {
    cars: [['1'], ['2']],
    messages: [generateServiceMessage()]
  }
}

export function generateServiceStateMessage(): MessageWrapper<ServiceState>[] {
  return [
    {
      msgClass: MessageClass.service_data,
      date: Date.now().toString(),
      payload: generateServiceState(),
    }
  ]
}

export function generateMockSession(): sinon.SinonStubbedInstance<Session> {
  return sinon.createStubInstance(Session)
}

export function generateSessionProvider(session: Session): SessionProvider {
  return sinon.stub().resolves(session)
}
