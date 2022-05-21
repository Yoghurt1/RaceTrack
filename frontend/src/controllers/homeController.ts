import { Request, Response, Router } from 'express'
import { Controller } from './controller'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { TimingService } from '../services/timingService'
import { ServiceManifest } from '../interfaces/serviceManifest'

@injectable()
export class HomeController implements Controller {
  public constructor(
    @inject(TYPES.TimingService) private timingService: TimingService
  ) { }

  public attachRoutes(router: Router) {
    router.get('/', this.get.bind(this))
  }

  private async get(req: Request, res: Response) {
    const events: ServiceManifest[] = this.timingService.getEvents()

    return res.render('home.html', { events: events })
  }
}
