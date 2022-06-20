import 'mocha'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { TwitterApiReadOnly } from 'twitter-api-v2'
import { Tweet } from '../../../src/interfaces/tweet'
import { TwitterService } from '../../../src/services/twitterService'
import { generateTweet, generateTwitterClient } from '../../fixtures/twitterFixtures'

describe('TwitterService', () => {
  let twitterService: TwitterService

  let twitterClient: TwitterApiReadOnly

  before(() => {
    twitterClient = generateTwitterClient()

    twitterService = new TwitterService(
      twitterClient
    )
  })

  describe('getHomepageTimeline', () => {
    it('should fetch and map a list of recent tweets for the given query', async () => {
      const expectedTweet: Tweet = generateTweet()
      
      const res: Tweet[] = await twitterService.getHomepageTimeline('query')

      assert.deepEqual(res[0].tweet, expectedTweet.tweet)
    })
  })

  after(() => {
    sinon.restore()
  })
})
