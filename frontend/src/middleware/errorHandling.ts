import { Application, Request, Response, NextFunction } from 'express'

export function attachErrorHandling(app: Application) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    const err = new Error('Not Found')
    err['status'] = 404
    return next(err)
  })

  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error({ error: err })

    if (res.headersSent) {
      return next(err)
    }

    res.status(err['status'] || 500)

    switch (err['status']) {
      case 404:
        res.render('includes/error/error-404.html')
        break
      default:
        res.render('includes/error/error.html')
        break
    }
  })
}
