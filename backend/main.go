package main

import (
	"log"
	"os"

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
	if os.Getenv("ENVIROMENT") == "production" {
		app.Static("/", "./public")
	} else {
		app.Static("/", "../public")
	}
	log.Fatal(app.Listen(":8080"))
}
