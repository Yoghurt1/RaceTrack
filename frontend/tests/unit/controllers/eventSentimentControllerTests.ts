import 'mocha'
import { assert } from 'chai'
import { anyString, instance, mock, when } from 'ts-mockito'
import { request, setupController } from '../setup'
import { EventSentimentController } from '../../../src/controllers/eventSentimentController'
import { TimingService } from '../../../src/services/timingService'
import { TwitterService } from '../../../src/services/twitterService'
import { TEST_UUID } from '../../../src/config'
import { generateServiceManifest, generateServiceMessage } from '../../fixtures/timingFixtures'
import { generateTweet } from '../../fixtures/twitterFixtures'
import { StatusCodes } from 'http-status-codes'
import { HtmlAssertHelper } from '../helpers'
import { ApiClient } from '../../../src/services/apiClient'
import { generateSentimentResponse } from '../../fixtures/apiFixtures'

describe('EventSentimentController', () => {

  let timingService: TimingService
  let twitterService: TwitterService
  let client: ApiClient

  before(() => {
    timingService = mock(TimingService)
    twitterService = mock(TwitterService)
    client = mock(ApiClient)

    setupController(
      new EventSentimentController(
        instance(timingService),
        instance(twitterService),
        instance(client)
      )
    )
  })

  describe('GET /', () => {
    beforeEach(() => {
      when(timingService.getEvent(TEST_UUID)).thenReturn(generateServiceManifest())
      when(twitterService.getTimeline(anyString())).thenResolve([generateTweet()])
      when(timingService.getRecentMessages(TEST_UUID)).thenResolve([generateServiceMessage()])
      when(client.getSentiment(TEST_UUID)).thenResolve(generateSentimentResponse())
    })

    it('should return event sentiment page', async () => {
      const res = await request
        .get(`/${TEST_UUID}`)
        .expect(StatusCodes.OK)

      const htmlAssertHelper = new HtmlAssertHelper(res.text)
      assert.isTrue(htmlAssertHelper.containsTextValue('#messages', 'some message'))
      assert.isTrue(htmlAssertHelper.containsTextValue('#tweets', 'some tweet text'))
      assert.isTrue(htmlAssertHelper.selectorExists('#sentimentChart'))
    })
  })
})
