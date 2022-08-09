import 'mocha'
import * as fs from 'fs'
import { ApiClient, ApiConfig } from '../../src/services/apiClient'
import { API_HOST, API_PORT, DATA_DIR, TEST_UUID } from '../../src/config'
import { execSync } from 'child_process'

export let client: ApiClient

before(async function () {
  this.timeout(600000)

  const clientConfig: ApiConfig = { baseUrl: `${API_HOST}:${API_PORT}` }

  client = new ApiClient(clientConfig)

  const testDir = `${DATA_DIR}/${TEST_UUID}`

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir)

    execSync(`cd ${testDir} && curl https://replay.timing71.org/${TEST_UUID}.zip --output ${TEST_UUID}.zip && unzip -qq ${TEST_UUID}.zip`)
  }
})
