import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Controller } from './controller'
import { NextFunction, Request, Response, Router } from 'express'
import { TYPES } from '../types'
import { TimingService } from '../services/timingService'
import { ServiceManifest } from '../interfaces/serviceManifest'
import { ColSpec } from '../interfaces/colSpec'
import { ColSpecMapper } from '../mappers/colSpecMapper'
import { VisualisationFormModel } from '../interfaces/visualisationFormModel'
import { ApiClient } from '../services/apiClient'
import { ChartResponse } from '../interfaces/api/chartResponse'
import { ChartRequest } from '../interfaces/api/chartRequest'
import { ChartRequestMapper } from '../mappers/chartRequestMapper'

interface EventVisualisationViewModel {
  formAction: string
  uuid: string
  colSpec: ColSpec[]
  form?: VisualisationFormModel
}

@injectable()
export class EventVisualisationController implements Controller {
  public constructor(
    @inject(TYPES.TimingService) private timingService: TimingService,
    @inject(TYPES.ColSpecMapper) private colSpecMapper: ColSpecMapper,
    @inject(TYPES.ChartRequestMapper) private chartRequestMapper: ChartRequestMapper,
    @inject(TYPES.ApiClient) private client: ApiClient
  ) { }

  public attachRoutes(router: Router) {
    router.get('/:eventUuid/visualise', this.get.bind(this))
    router.post('/:eventUuid/visualise', this.post.bind(this))
    router.get('/:eventUuid/visualise/classes', this.getClasses.bind(this))
    router.get('/:eventUuid/visualise/cars', this.getCarNums.bind(this))
  }

  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      const uuid: string = req.params.eventUuid

      this.showVisualisationPage(res, uuid)
    } catch (err) {
      return next(err)
    }
  }

  private async post(req: Request, res: Response, next: NextFunction) {
    try {
      const uuid: string = req.params.eventUuid
      const body: VisualisationFormModel = req.body

      const request: ChartRequest = this.chartRequestMapper.mapToRequest(uuid, body)

      const response: ChartResponse[] = await this.client.getChartData(request)

      return res.json(response)
    } catch (err) {
      return next(err)
    }
  }

  private showVisualisationPage(res: Response, uuid: string, form?: VisualisationFormModel) {
    const manifest: ServiceManifest = this.timingService.getEvent(uuid)
    const colSpec: ColSpec[] = this.colSpecMapper.mapToColSpec(manifest.colSpec)

    const viewModel: EventVisualisationViewModel = {
      formAction: `/${uuid}/visualise`,
      uuid: uuid,
      colSpec: colSpec,
      form: form
    }

    return res.render('event-visualise.html', viewModel)
  }

  private async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.client.getClasses(req.params.eventUuid)
      return res.json(response)
    } catch (err) {
      return next(err)
    }
  }

  private async getCarNums(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.client.getCarNums(req.params.eventUuid)
      return res.json(response)
    } catch (err) {
      return next(err)
    }
  }
}
