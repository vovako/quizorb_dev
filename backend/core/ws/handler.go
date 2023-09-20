package ws

import (
	"encoding/json"

	"github.com/Izumra/OwnGame/core/dto"
	"github.com/Izumra/OwnGame/core/entity"
	"github.com/Izumra/OwnGame/core/service"
	"github.com/Izumra/OwnGame/tools"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func UpdateWS() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return c.Status(fiber.StatusUpgradeRequired).JSON(tools.BadRes(fiber.StatusUpgradeRequired, fiber.ErrUpgradeRequired))
	}
}

var connections = make(map[string]*entity.Client)

func Connection() fiber.Handler {
	return websocket.New(func(c *websocket.Conn) {
		for {
			conn := c.RemoteAddr().String()
			connections[conn] = &entity.Client{
				Address: conn,
				Conn:    c,
			}
			type request struct {
				Act  string          `json:"action"`
				Data json.RawMessage `json:"data"`
			}
			var req request
			if err := c.ReadJSON(&req); err != nil {
				websocket.IsUnexpectedCloseError(err, websocket.CloseNormalClosure)
			}
			switch req.Act {
			case "game":
				var players []entity.Player
				if err := json.Unmarshal(req.Data, &players); err != nil {
					c.WriteJSON(err.Error())
				}
				game, err := entity.CreateGame(players)
				if err != nil {
					c.WriteJSON(err.Error())
				}
				game.Questions = entity.SetQuestions()
				game.AddLead(connections[conn])
				connections[conn].InGame = true
				for _, v := range connections {
					if !v.InGame {
						if err := game.AddViewer(v); err != nil {
							c.WriteJSON(err.Error())
						} else {
							v.InGame = true
							v.Conn.WriteJSON(game)
						}
					}

				}
			case "select_question":
				body := service.ValidateBody[dto.SelectQuestionBody](dto.SelectQuestionBody{}, req.Data)
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.SelectQuestion(body.Question); err != nil {
						c.WriteJSON(err.Error())
					}
				}
			case "answer_question":
				body := service.ValidateBody[dto.AnswerQuestionBody](dto.AnswerQuestionBody{}, req.Data)
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.AnswerQuestion(body.Question, body.Value, body.Answers); err != nil {
						c.WriteJSON(err.Error())
					}
				}
			case "reconnect":
				body := service.ValidateBody[dto.ReconnectBody](dto.ReconnectBody{}, req.Data)
				entity.GetGame(body.Game)
			}
		}
	})
}
