package ws

import (
	"github.com/gofiber/fiber/v2"
)

func SetWebSocket(app *fiber.App) {
	app.Use("/websocket", UpdateWS())
	app.Get("/websocket/connection", Connection())
}
