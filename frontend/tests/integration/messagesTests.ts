import 'mocha'
import * as fs from 'fs'
import { assert } from 'chai'
import { client } from './setup'
import { DATA_DIR, TEST_UUID } from '../../src/config'
import { generateMessageFile, generateServiceMessageResponse } from '../fixtures/timingFixtures'

describe('API - Messages tests', () => {
  describe('GET /messages/:uuid', () => {
    before(() => {
      const testDir = `${DATA_DIR}/${TEST_UUID}1`

      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir)
      }
    })

    it('should return the latest messages for an event', async () => {
      const timestamp = Date.now().toString()
      const expectedResponse = generateServiceMessageResponse()
      const fileContent = JSON.stringify(generateMessageFile(expectedResponse))
      insertEventFile(timestamp, fileContent)

      const res = await client.getRecentMessages(`${TEST_UUID}1`)

      assert.deepEqual(res, [expectedResponse])

      after(() => {
        deleteEventFile(timestamp)
      })
    })
  })
})

function insertEventFile(fileName: string, fileContent: string) {
  fs.writeFileSync(`${DATA_DIR}/${TEST_UUID}1/${fileName}.json`, Buffer.from(fileContent))
}

function deleteEventFile(fileName: string) {
  fs.rmSync(`${DATA_DIR}/${TEST_UUID}1/${fileName}.json`)
}
