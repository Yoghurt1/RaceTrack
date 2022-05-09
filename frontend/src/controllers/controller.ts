import { Router } from 'express'

export interface Controller {
  attachRoutes: (router: Router) => void
}
