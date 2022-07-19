import { MessageClass } from '../enums'

export interface MessageWrapper<T> {
  msgClass: MessageClass,
  date: string,
  payload: T
  retain?: boolean,
}
