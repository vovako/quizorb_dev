package main

import (
	"log"

	"github.com/Izumra/OwnGame/core/ws"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New(fiber.Config{
		ServerHeader: "Own game",
	})
	ws.SetWebSocket(app)
	app.Use(cors.New())
	app.Static("/", "./quizorb/backend/public")
	log.Fatal(app.Listen(":8080"))
}
