import 'mocha'
import { ApiClient, ApiConfig } from '../../src/services/apiClient'
import { API_HOST, API_PORT } from '../../src/config'

export let client: ApiClient

before(() => {
  const clientConfig: ApiConfig = { baseUrl: `${API_HOST}:${API_PORT}` }

  client = new ApiClient(clientConfig)
})
