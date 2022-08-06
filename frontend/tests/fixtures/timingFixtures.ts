import { LivetimingVersion } from '../../src/interfaces/livetimingVersion'
import { ServiceManifest } from '../../src/interfaces/serviceManifest'
import { SessionProvider } from '../../src/provider'
import * as sinon from 'sinon'
import { Session } from 'autobahn'
import { MessageWrapper } from '../../src/interfaces/messageWrapper'
import { ServiceState } from '../../src/interfaces/serviceState'
import { MessageClass } from '../../src/enums'
import { ServiceMessage } from '../../src/interfaces/serviceMessage'
import { ColSpec } from '../../src/interfaces/colSpec'

export function generateServiceManifest(): ServiceManifest {
  return {
    colSpec: generateStringColSpec(),
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

export function generateStringColSpec(): string[][] {
  return [
    ['Num', 'text', 'Car number'],
    ['State', 'text'],
    ['Class', 'class'],
    ['PIC', 'numeric', 'Position in class'],
    ['Driver', 'text'],
    ['Team', 'text'],
    ['Car', 'text'],
    ['Laps', 'numeric'],
    ['Gap', 'delta', 'Gap to leader'],
    ['Int', 'delta', 'Interval to car in front'],
    ['S1', 'time', 'Sector 1 time'],
    ['S2', 'time', 'Sector 2 time'],
    ['S3', 'time', 'Sector 3 time'],
    ['Last', 'time', 'Last lap time'],
    ['Best', 'time', 'Best lap time'],
    ['Pits', 'numeric']]
}

export function generateColSpec(): ColSpec[] {
  return [
    { name: 'Num', dtype: 'text', description: 'Car number' },
    { name: 'State', dtype: 'text' },
    { name: 'Class', dtype: 'class' },
    { name: 'PIC', dtype: 'numeric', description: 'Position in class' },
    { name: 'Driver', dtype: 'text' },
    { name: 'Team', dtype: 'text' },
    { name: 'Car', dtype: 'text' },
    { name: 'Laps', dtype: 'numeric' },
    { name: 'Gap', dtype: 'delta', description: 'Gap to leader' },
    { name: 'Int', dtype: 'delta', description: 'Interval to car in front' },
    { name: 'S1', dtype: 'time', description: 'Section 1 time' },
    { name: 'S2', dtype: 'time', description: 'Section 2 time' },
    { name: 'S3', dtype: 'time', description: 'Section 3 time' },
    { name: 'Last', dtype: 'time', description: 'Last lap time' },
    { name: 'Best', dtype: 'time', description: 'Best lap time' },
    { name: 'Pits', dtype: 'numeric' },
  ]
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

export function generateServiceMessageResponse(): (string | number)[] {
  return [
    1653828921,
    'SP 9',
    '#7 (Pepper) has left the pits',
    'out',
    '7'
  ]
}

export function generateMessageFile(message) {
  return {
    messages: [
      message
    ]
  }
}
