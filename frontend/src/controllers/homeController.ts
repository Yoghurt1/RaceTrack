import { NextFunction, Request, Response, Router } from 'express'
import { Controller } from './controller'
import { injectable } from 'inversify'

@injectable()
export class HomeController implements Controller {
  public constructor() {}

  public attachRoutes(router: Router) {
    router.get('/', this.get.bind(this))
  }

  private async get(req: Request, res: Response, next: NextFunction) {
    return res.render('home.html')
  }
}