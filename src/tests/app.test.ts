import request from "supertest"
import app from "../app.js"

describe("Express API tests", () => {
  // Test 1: GET /
  it("return api information of the server", async () => {
    const response = await request(app).get("/")
    const data = [
      {
        method: "GET",
        path: "/"
      },
      {
        method: "GET",
        path: "/health"
      },
      {
        method: "POST",
        path: "/event",
        bodyType: {
          event: "string",
          userId: "number"
        }
      }
    ]
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        success: "ok",
        api: data
      })
    )
  })

  // Test 2: GET /health
  it("should return 200 from health check", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "healthy",
        version: expect.any(String),
        uptime: expect.any(Number)
      })
    )
  })

  // Test 3: POST /event with valid payload
  it("should create event successfully", async () => {
    const payload = {
      event: "user_registered",
      userId: 11
    }
    const response = await request(app).post("/event").send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Event received successfully",
        data: payload
      })
    )
  })

  // Test 4: POST /event with invalid payload
  it("should return 400 for invalid payload", async () => {
    const payload = {
      event: 978,
      userId: "user"
    }
    const response = await request(app).post("/event").send(payload)
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Invalid event payload")
    expect(response.body.errors.length).toBeGreaterThan(1)
  })
})
