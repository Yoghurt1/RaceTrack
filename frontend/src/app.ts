import { Connection } from 'autobahn'
import { RelayResponse } from './interfaces/relayResponse'
import { RelayEntries } from './interfaces/relayEntries'
import axios, { AxiosResponse } from 'axios'
import { DirectoryMessage } from './interfaces/directoryMessage'

async function getRelay(): Promise<string> {
  const res: AxiosResponse = await axios.get('https://www.timing71.org/relays')
  const data: RelayResponse = await res.data

  if (!data) {
    throw new Error('Failed to fetch timing relays.')
  }

  const relays: RelayEntries = data.args[0]

  let numConnections = Number.MAX_SAFE_INTEGER
  let bestRelay!: string

  for (const relay of Object.keys(relays)) {
    if (relays[relay][0] < numConnections) {
      numConnections = relays[relay][0]
      bestRelay = relay
    }
  }

  return bestRelay
}

getRelay().then(async (res) => {
  const connection = new Connection({
    url: res,
    realm: 'timing'
  })

  connection.onopen = function (session) {
    function onevent(args: DirectoryMessage[]) {
      console.log(args[0].payload)
    }

    session.subscribe('livetiming.directory', onevent, { get_retained: true })
  }

  connection.open()
})

