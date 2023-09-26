package ws

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/Izumra/OwnGame/core/dto"
	"github.com/Izumra/OwnGame/core/entity"
	"github.com/Izumra/OwnGame/tools"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func UpdateWS() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return c.Status(fiber.StatusUpgradeRequired).JSON("Авторизация не удалась")
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
				Role:    "Viewer",
			}
			type request struct {
				Act  string          `json:"action"`
				Data json.RawMessage `json:"data"`
			}
			var req request
			if err := c.ReadJSON(&req); err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseNormalClosure) {
					delete(connections, conn)
					log.Println("Вышел при чтении", err.Error())
					return
				}
			}
			switch req.Act {
			case "game":
				game, err := entity.CreateGame()
				if err != nil {
					log.Println(err.Error())
					return
				}
				game.AddLead(connections[conn])
				connections[conn].InGame = true
				connections[conn].Role = "Lead"
				for _, v := range connections {
					if !v.InGame && v.Role == "Viewer" {
						if err := game.AddViewer(v); err != nil {
							log.Println(err.Error())
							return
						} else {
							v.InGame = true
							type Resp struct {
								ID     uuid.UUID
								Themes []entity.Theme
							}
							err := game.Lead.Conn.WriteJSON(tools.SuccessRes("game", Resp{ID: game.ID, Themes: game.Themes}))
							er := game.Viewer.Conn.WriteJSON(tools.SuccessRes("game", Resp{ID: game.ID, Themes: game.Themes}))
							if err != nil || er != nil {
								log.Printf("ошибки при создании игры: отправка ответа зрителю - %v; отправка ответа ведущему %v", er, err)
								return
							}
							break
						}
					}

				}
			case "get_themes":
				var id uuid.UUID
				if err := json.Unmarshal(req.Data, &id); err != nil {
					return
				}
				if game := entity.GetGame(id); game != nil {
					if err := game.GetThemes(); err != nil {
						log.Println(err.Error())
						return
					}
				} else {
					tools.BadRes("get_themes", fmt.Errorf("игра не найдена"))
				}
			case "select_theme":
				var body dto.SelectThemeBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.SelectTheme(body.Theme); err != nil {
						log.Println(err.Error())
						return
					}
				} else {
					tools.BadRes("select_theme", fmt.Errorf("игра не найдена"))
				}
			case "select_question":
				var body dto.SelectQuestionBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.SelectQuestion(body.Question); err != nil {
						log.Println(err.Error())
						return
					}
				}
			case "answer_question":
				var body dto.AnswerQuestionBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.AnswerQuestion(body.Question, body.Status); err != nil {
						log.Println(err.Error())
						return
					}
				}
			case "reconnect":
				var body dto.ReconnectBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				connections[conn].Role = body.Role
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.Reconnect(connections[conn]); err != nil {
						log.Println(err.Error())
						return
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("reconnect", fmt.Errorf("игра не найдена"))); err != nil {
					log.Println(err)
					return
				}
			case "to-tiles":
				var id_game uuid.UUID
				if err := json.Unmarshal(req.Data, &id_game); err != nil {
					return
				}
				if game := entity.GetGame(id_game); game != nil {
					err := game.Viewer.Conn.WriteJSON(tools.SuccessRes("to-tiles", "to-tiles"))
					er := game.Lead.Conn.WriteJSON(tools.SuccessRes("to-tiles", "to-tiles"))
					if err != nil || er != nil {
						log.Printf("ошибки при возвращении к вопросам: перенос зрителя - %v; перенос ведущего %v", err, er)
						return
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("reconnect", fmt.Errorf("игра не найдена"))); err != nil {
					log.Println(err)
					return
				}
			}
		}
	})
}