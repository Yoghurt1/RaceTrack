import { Application, Request, Response, NextFunction } from 'express'

export function attachErrorHandling(app: Application) {
  app.use(function(req: Request, res: Response, next: NextFunction) {
    const err = new Error('Not Found')
    return next(err)
  })

  app.use(function(err: Error, req: Request) {
    console.error({ error: err, request: req })
  })
}
