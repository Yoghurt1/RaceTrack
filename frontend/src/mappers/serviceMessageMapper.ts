import { injectable } from 'inversify'
import { ServiceMessage } from '../interfaces/serviceMessage'

@injectable()
export class ServiceMessageMapper {
  public mapToServiceMessage(message: (string | number)[]): ServiceMessage {
    const formattedMessage: ServiceMessage = {
      timestamp: Number(message[0]),
      category: <string>message[1],
      message: <string>message[2],
      messageType: <string>message[3],
    }

    if (message.length === 5) {
      formattedMessage.carNumber = <string>message[4]
    }

    return formattedMessage
  }
}
