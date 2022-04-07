import { FlagStatus } from '../enums'

export interface SessionData {
  flagState: FlagStatus
  timeElapsed?: number
  timeRemain?: number
  lapsRemain?: number
  trackData?: string[]
}