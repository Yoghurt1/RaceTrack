import 'mocha'
import * as fs from 'fs'
import { assert } from 'chai'
import { DATA_DIR, TEST_UUID } from '../../src/config'
import { generateSentimentCsv } from '../fixtures/apiFixtures'
import { client } from './setup'
import { SentimentResponse } from '../../src/interfaces/api/sentimentResponse'

describe('API - Sentiment tests', () => {
  describe('GET /sentiment/:uuid', () => {
    before(() => {
      const testDir = `${DATA_DIR}/${TEST_UUID}1`

      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir)
      }
    })

    it('should return the sentiment for an event', async () => {
      insertSentimentFile(generateSentimentCsv())

      const res: SentimentResponse[] = await client.getSentiment(`${TEST_UUID}1`)

      assert.equal(res[0].sentiment, 1)
      assert.isTrue(res[0].time.startsWith(new Date().toISOString().slice(0, 10)))

      deleteSentimentFile()
    })
  })
})

function insertSentimentFile(fileContent: string) {
  fs.writeFileSync(`${DATA_DIR}/${TEST_UUID}1/sentiment.csv`, Buffer.from(fileContent))
}

function deleteSentimentFile() {
  fs.rmSync(`${DATA_DIR}/${TEST_UUID}1/sentiment.csv`)
}
