import { MessageClass } from '../enums'
import { ServiceManifest } from './serviceManifest'

export interface DirectoryMessage {
  msgClass: MessageClass,
  date: number,
  payload: ServiceManifest[]
  retain: boolean
}
