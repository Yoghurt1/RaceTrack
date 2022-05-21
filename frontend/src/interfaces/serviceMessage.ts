export interface ServiceMessage {
  timestamp: number
  category: string
  message: string
  messageType: string
  carNumber?: string
}
