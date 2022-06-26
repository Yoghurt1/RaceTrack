import 'reflect-metadata'
import { Request, Response, Router } from 'express'
import { Controller } from './controller'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { TimingService } from '../services/timingService'
import { ServiceManifest } from '../interfaces/serviceManifest'
import { ApiClient } from '../services/apiClient'
import { TwitterService } from '../services/twitterService'
import { Tweet } from '../interfaces/tweet'

interface HomeViewModel {
  events: ServiceManifest[]
  apiRes: any
  tweets: Tweet[]
}

@injectable()
export class HomeController implements Controller {
  public constructor(
    @inject(TYPES.TimingService) private timingService: TimingService,
    @inject(TYPES.ApiClient) private client: ApiClient,
    @inject(TYPES.TwitterService) private twitterService: TwitterService
  ) { }

  public attachRoutes(router: Router) {
    router.get('/', this.get.bind(this))
  }

  private async get(req: Request, res: Response) {
    const test: any = await this.client.route()
    const events: ServiceManifest[] = this.timingService.getEvents()

    const twitterSearchQuery: string = events.length > 0 ? events[0].serviceClass : 'f1'
    const tweets: Tweet[] = await this.twitterService.getHomepageTimeline(twitterSearchQuery)

    const viewModel: HomeViewModel = {
      events: events,
      apiRes: test,
      tweets: tweets
    }

    return res.render('home.html', viewModel)
  }
}
