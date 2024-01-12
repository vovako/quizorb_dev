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
			if _, ok := connections[conn]; !ok {
				connections[conn] = &entity.Client{
					Address: conn,
					Conn:    c,
					Role:    "Viewer",
				}
			}
			type request struct {
				Act  string          `json:"action"`
				Data json.RawMessage `json:"data"`
			}
			var req request
			if err := c.ReadJSON(&req); err != nil {
				if websocket.IsUnexpectedCloseError(err) || websocket.IsCloseError(err) {
					connections[conn].InGame = false
					connections[conn].Conn = nil
					delete(connections, conn)
					log.Println("Вышел при чтении", err.Error())
					for _, v := range connections {
						if v != nil && !v.InGame {
							v.Conn.WriteJSON(tools.SuccessRes("games", entity.GetGames()))
						}
					}
					return
				}
			}
			log.Println(req.Act, connections[conn].Address, connections[conn].Role)
			for i, v := range connections {
				log.Println(i, v.InGame, v.Role)
			}
			switch req.Act {
			case "game":
				type Body struct {
					Pass  string `json:"password"`
					Title string `json:"title"`
				}
				var body Body
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				_, err := entity.CreateGame(body.Title, body.Pass)
				if err != nil {
					return
				}
				for _, v := range connections {
					if v != nil && !v.InGame {
						v.Conn.WriteJSON(tools.SuccessRes("games", entity.GetGames()))
					}
				}
				er := connections[conn].Conn.WriteJSON(tools.SuccessRes("game", "Игра создана"))
				if er != nil {
					return
				}
			case "connect":
				var body dto.ConnectBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					connections[conn].Role = body.Role
					if err := game.Connect(connections[conn], body.Pass); err != nil {
						er := connections[conn].Conn.WriteJSON(tools.BadRes("connect", err))
						if er != nil {
							return
						}
					}
					for _, v := range connections {
						if v != nil && !v.InGame {
							v.Conn.WriteJSON(tools.SuccessRes("games", entity.GetGames()))
						}
					}
				} else {
					if err := connections[conn].Conn.WriteJSON(tools.BadRes("connect", fmt.Errorf("игра не найдена"))); err != nil {
						return
					}
				}
			case "games":
				err := connections[conn].Conn.WriteJSON(tools.SuccessRes("games", entity.GetGames()))
				if err != nil {
					return
				}
			case "get_themes":
				var id uuid.UUID
				if err := json.Unmarshal(req.Data, &id); err != nil {
					return
				}
				if game := entity.GetGame(id); game != nil {
					if err := game.GetThemes(); err != nil {
						return
					}
				} else {
					if err := connections[conn].Conn.WriteJSON(tools.BadRes("get_themes", fmt.Errorf("игра не найдена"))); err != nil {
						return
					}
				}
			case "select_theme":
				var body dto.SelectThemeBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.SelectTheme(body.Theme); err != nil {
						return
					}
				} else {
					if err := connections[conn].Conn.WriteJSON(tools.BadRes("select_theme", fmt.Errorf("игра не найдена"))); err != nil {
						return
					}
				}
			case "select_question":
				var body dto.SelectQuestionBody
				if err := json.Unmarshal(req.Data, &body); err != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.SelectQuestion(body.Question); err != nil {
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
					addres, err := game.Reconnect(connections[conn])
					delete(connections, addres)
					if err != nil {
						return
					}
					connections[conn].InGame = true
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("reconnect", fmt.Errorf("игра не найдена"))); err != nil {
					return
				}
			case "to-tiles":
				var id_game uuid.UUID
				if err := json.Unmarshal(req.Data, &id_game); err != nil {
					delete(connections, conn)
					return
				}
				if game := entity.GetGame(id_game); game != nil {
					if err := game.SendResponse(tools.SuccessRes("to-tiles", "to-tiles")); err != nil {
						return
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("reconnect", fmt.Errorf("игра не найдена"))); err != nil {
					return
				}
			case "restart_game":
				var id_game uuid.UUID
				if err := json.Unmarshal(req.Data, &id_game); err != nil {
					return
				}
				if game := entity.GetGame(id_game); game != nil {
					g, err := entity.CreateGame(game.Title, game.Pass)
					if err != nil {
						return
					}
					g.Lead = game.Lead
					g.Viewer = game.Viewer
					var e, er error
					if g.Lead != nil && g.Lead.Conn != nil {
						e = g.Lead.Conn.WriteJSON(tools.SuccessRes("restart_game", g.ID))
					}
					if g.Viewer != nil && g.Viewer.Conn != nil {
						er = g.Viewer.Conn.WriteJSON(tools.SuccessRes("restart_game", g.ID))
					}
					game.Lead = nil
					game.Viewer = nil
					entity.DeleteGame(id_game)
					if er != nil || e != nil {
						return
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("delete_game", fmt.Errorf("игра не найдена"))); err != nil {
					return
				}
			case "question_trash":
				var id_game uuid.UUID
				if err := json.Unmarshal(req.Data, &id_game); err != nil {
					return
				}
				if game := entity.GetGame(id_game); game != nil {
					if el, ans := game.GetTrashQuestion(); el != nil {
						type Resp struct {
							Question *entity.Question
							Answer   string
						}
						if err := game.SendResponse(tools.SuccessRes("question_trash", Resp{Question: el, Answer: ans})); err != nil {
							return
						}
					} else {
						if err := game.SendResponse(tools.BadRes("question_trash", fmt.Errorf("корзина пуста"))); err != nil {
							return
						}
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("question_trash", fmt.Errorf("игра не найдена"))); err != nil {
					return
				}
			case "answer_question_trash":
				var body dto.AnswerTrashQuestion
				if er := json.Unmarshal(req.Data, &body); er != nil {
					return
				}
				if game := entity.GetGame(body.Game); game != nil {
					if err := game.AnswerTrashQuestion(body.Question, body.Status); err != nil {
						return
					}
				} else if err := connections[conn].Conn.WriteJSON(tools.BadRes("answer_question_trash", fmt.Errorf("игра не найдена"))); err != nil {
					return
				}
			case "ping":
				if connections[conn] != nil && connections[conn].Conn != nil {
					connections[conn].Conn.WriteJSON(tools.SuccessRes("ping", "pong"))
				} else {
					return
				}
			}
		}
	})
}
