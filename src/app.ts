import express from "express"
import type { Express, Request, Response } from "express"
import { EventData } from "./schema.js";

const app: Express = express()

app.use(express.json())

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "healthy",
    version: process.version,
    uptime: process.uptime()
  })
})

app.post("/event", (req: Request, res: Response) => {
  const result = EventData.safeParse(req.body)
  if (!result.success) return res.status(400).json({
    message: "Invalid event payload",
    errors: result.error.issues
  })
  const eventData = result.data
  return res.status(201).json({
    message: "Event received successfully",
    data: eventData
  })
})

export default app


