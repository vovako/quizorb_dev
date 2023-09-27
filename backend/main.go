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
	app.Static("/", "../public")
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendFile("../public/index.html")
	})
	app.Get("/view", func(c *fiber.Ctx) error {
		return c.SendFile("../public/view.html")
	})
	log.Fatal(app.Listen(":8080"))
}
