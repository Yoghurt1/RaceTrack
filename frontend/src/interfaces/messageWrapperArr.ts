import { MessageClass } from '../enums'

export interface MessageWrapperArr<T> {
  msgClass: MessageClass,
  date: string,
  payload: T[]
  retain?: boolean,
}
