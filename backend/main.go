package main

import (
	"log"

	"github.com/Izumra/OwnGame/core/ws"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/template/html/v2"
)

func main() {
	engine := html.New("../public", ".html")
	app := fiber.New(fiber.Config{
		ServerHeader: "Own game",
		Views:        engine,
	})
	ws.SetWebSocket(app)
	app.Use(cors.New())
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", nil)
	})
	app.Get("/view", func(c *fiber.Ctx) error {
		return c.Render("view", nil)
	})
	log.Fatal(app.Listen(":8080"))
}
