import { ServiceMessage } from './serviceMessage'

export interface ServiceState {
  cars: string[][]
  messages: ServiceMessage[]
}
