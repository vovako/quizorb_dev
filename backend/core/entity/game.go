package entity

import (
	"fmt"

	"github.com/Izumra/OwnGame/core/dto"
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type Game struct {
	ID        uuid.UUID `json:"id"`
	Question  uint
	Players   []Player
	Questions []Question
	Lead      *Client
	Viewer    *Client
}

var gamesStore = make(map[uuid.UUID]*Game)

func CreateGame(players []Player) (*Game, error) {
	key, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}
	gamesStore[key] = &Game{
		ID:        key,
		Players:   players,
		Questions: SetQuestions(),
	}
	return gamesStore[key], nil
}

func GetGame(game uuid.UUID) *Game {
	return gamesStore[game]
}

// Можно ли прикрутить к подключению к игре
func JoinGame(viewer *Client) *Game {
	for _, v := range gamesStore {
		if v.Viewer == nil && v.Lead.Address != viewer.Address {
			v.Viewer = viewer
			return v
		}
	}
	return nil
}

type Repository interface {
	AddLead(*websocket.Conn) error
	AddViewer(*websocket.Conn) error
	SelectQuestion(uint) error
	AnswerQuestion([]dto.Answer) error
	Reconnect(*Client) error
	Connect(*Client) error
}

func (game *Game) AddLead(lead *Client) error {
	if game.Lead != nil {
		return fmt.Errorf("в игре уже есть ведущий")
	} else {
		game.Lead = lead
		return nil
	}
}

func (game *Game) AddViewer(viewer *Client) error {
	if game.Viewer != nil {
		return fmt.Errorf("в игре уже есть наблюдатель")
	} else {
		game.Viewer = viewer
		return nil
	}
}

func (game *Game) SelectQuestion(question uint) error {
	if game.Question == 0 && !game.Questions[question].Solved {
		game.Question = question
		type Response struct {
			Players  []Player
			Question Question
		}
		resp := Response{
			Question: game.Questions[question],
			Players:  game.Players,
		}
		err := game.Lead.Conn.WriteJSON(resp)
		er := game.Viewer.Conn.WriteJSON(game.Questions[question])
		if err != nil || er != nil {
			return fmt.Errorf("ошибка при ответе ведущему: %v, ошибка при ответе зрителям: %v", err, er)
		}
		return nil
	} else if game.Questions[question].Solved {
		return fmt.Errorf("выбранный вопрос уже решен")
	}
	return fmt.Errorf("вопрос уже выбран")
}

func (game *Game) AnswerQuestion(question uint, costs int, answers []dto.Answer) error {
	for i, v := range game.Players {
		for _, val := range answers {
			if val.ID == v.ID {
				if val.Right {
					game.Players[i].Score += costs
				} else {
					game.Players[i].Score -= costs
				}
			}
		}
	}
	game.Question = 0
	game.Questions[question].Solved = true
	er := game.Viewer.Conn.WriteJSON(game.Questions)
	err := game.Lead.Conn.WriteJSON(game.Questions)
	if err != nil || er != nil {
		return fmt.Errorf("ошибка при ответе ведущему: %v, ошибка при ответе зрителям: %v", err, er)
	}
	return nil
}

func (game *Game) Reconnect(client *Client) error {
	if client.Role == "Lead" {
		game.Lead = client
		client.InGame = true
		if err := game.Lead.Conn.WriteJSON(game.Questions); err != nil {
			return err
		}
		return nil
	} else if client.Role == "Viewer" {
		game.Viewer = client
		client.InGame = true
		if err := game.Viewer.Conn.WriteJSON(game.Questions); err != nil {
			return err
		}
		return nil
	}
	return fmt.Errorf("неизвестная роль")
}

func (game *Game) Connect(c *Client) error {
	if game.Viewer == nil {
		game.Viewer.InGame = true
		game.Viewer = c
		err := game.Viewer.Conn.WriteJSON(game.Questions)
		if game.Lead != nil {
			er := game.Lead.Conn.WriteJSON("Игрок подключился")
			if er != nil {
				return er
			}
		}
		if err != nil {
			return err
		}
	}
	return fmt.Errorf("в игре уже есть зритель")
}
