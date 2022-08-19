import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Controller } from './controller'
import { NextFunction, Request, Response, Router } from 'express'
import { TYPES } from '../types'
import { TimingService } from '../services/timingService'
import { TwitterService } from '../services/twitterService'
// import { ServiceManifest } from '../interfaces/serviceManifest'
import { Tweet } from '../interfaces/tweet'
import { ServiceMessage } from '../interfaces/serviceMessage'
import { ApiClient } from '../services/apiClient'
import { SentimentResponse } from '../interfaces/api/sentimentResponse'

interface EventSentimentViewModel {
  tweets: Tweet[]
  messages: ServiceMessage[]
  chartData: SentimentResponse[]
  uuid: string
}

@injectable()
export class EventSentimentController implements Controller {
  public constructor(
    @inject(TYPES.TimingService) private timingService: TimingService,
    @inject(TYPES.TwitterService) private twitterService: TwitterService,
    @inject(TYPES.ApiClient) private client: ApiClient
  ) { }

  public attachRoutes(router: Router) {
    router.get('/:eventUuid', this.get.bind(this))
  }

  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      const uuid: string = req.params.eventUuid

      // const manifest: ServiceManifest = this.timingService.getEvent(uuid)
      const tweets: Tweet[] = await this.twitterService.getTimeline('f1')
      const messages: ServiceMessage[] = await this.getMessages(uuid)
      const chartData: SentimentResponse[] = await this.client.getSentiment(uuid)

      const viewModel: EventSentimentViewModel = {
        tweets: tweets,
        messages: messages,
        chartData: chartData,
        uuid: uuid
      }

      return res.render('event-sentiment.html', viewModel)
    } catch (err) {
      return next(err)
    }
  }

  private async getMessages(uuid: string): Promise<ServiceMessage[]> {
    return (await this.timingService.getRecentMessages(uuid)).slice(0, 10)
  }
}
