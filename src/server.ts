import app from "./app.js"

const PORT = 3000
const server = app.listen(PORT, "0.0.0.0", () => console.log(`server running on port ${PORT}`))

const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal} signal\nStarting to shudown the server`)
  server.close(() => {
    console.log("HTTP server closed")
    process.exit(0)
  })
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))
