import { LivetimingVersion } from '../../src/interfaces/livetimingVersion'
import { ServiceManifest } from '../../src/interfaces/serviceManifest'

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
    uuid: '01234567abcdefg'
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
