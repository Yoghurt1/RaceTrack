import 'mocha'
import { assert } from 'chai'
import { anyString, instance, mock, verify, when } from 'ts-mockito'
import { HomeController } from '../../../src/controllers/homeController'
import { TimingService } from '../../../src/services/timingService'
import { request, setupController } from '../setup'
import { generateServiceManifest } from '../../fixtures/timingFixtures'
import { StatusCodes } from 'http-status-codes'
import { TwitterService } from '../../../src/services/twitterService'
import { HtmlAssertHelper } from '../helpers'
import { generateTweet } from '../../fixtures/twitterFixtures'

describe('HomeController', () => {

  let timingService: TimingService
  let twitterService: TwitterService

  before(() => {
    timingService = mock(TimingService)
    twitterService = mock(TwitterService)

    setupController(
      new HomeController(
        instance(timingService),
        instance(twitterService)
      )
    )
  })

  describe('GET /', () => {
    beforeEach(() => {
      when(timingService.getEvents()).thenReturn([generateServiceManifest()])
      when(twitterService.getTimeline(anyString())).thenResolve([generateTweet()])
    })

    it('should return homepage', async () => {
      const res = await request
        .get('/')
        .expect(StatusCodes.OK)

      const htmlAssertHelper = new HtmlAssertHelper(res.text)
      assert.isTrue(htmlAssertHelper.containsTextValue('#events', 'some description'))
      assert.isTrue(htmlAssertHelper.containsTextValue('#tweets', 'some tweet text'))
    })

    it('should display a message if no events are ongoing', async () => {
      when(timingService.getEvents()).thenReturn([])

      const res = await request
        .get('/')
        .expect(StatusCodes.OK)

      const htmlAssertHelper = new HtmlAssertHelper(res.text)
      assert.isTrue(htmlAssertHelper.containsTextValue('#events', 'No events currently ongoing'))
    })

    it('should return a Twitter timeline based on the most recent active event if present', async () => {
      when(timingService.getEvents()).thenReturn([generateServiceManifest()])

      await request
        .get('/')
        .expect(StatusCodes.OK)

      verify(twitterService.getTimeline('someservice')).called()
    })

    it('should return a Twitter timeline based on F1 if no events present', async () => {
      when(timingService.getEvents()).thenReturn([generateServiceManifest()])

      await request
        .get('/')
        .expect(StatusCodes.OK)

      verify(twitterService.getTimeline('f1')).called()
    })
  })
})
