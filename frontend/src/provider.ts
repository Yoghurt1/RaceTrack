import { Connection, Session } from 'autobahn'
import { interfaces } from 'inversify'
import { TYPES } from './types'

export type SessionProvider = () => Promise<Session>

export function sessionProvider({ container }: interfaces.Context) {
  return () => {
    return new Promise<Session>((resolve) => {
      const conn = container.get<Connection>(TYPES.Connection)
    
      conn.onopen = function(session) {
        container.bind<Session>(TYPES.Session).toConstantValue(session)
        resolve(session)
      }

      conn.open()
    })
  }
}
