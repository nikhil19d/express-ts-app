import request from "supertest"
import app from "../app.js"

describe("Express API tests", () => {
  // Test 1: GET /health
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

  // Test 2: POST /event with valid payload
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

  // Test 3: POST /event with invalid payload
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
