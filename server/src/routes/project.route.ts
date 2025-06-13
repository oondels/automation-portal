import Router, { Request, Response, NextFunction } from "express"

export const projectRoute = Router()

projectRoute.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
  }
  catch (error) {
    next(error)
  }
})