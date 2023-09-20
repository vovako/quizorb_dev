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
var games []uuid.UUID

func CreateGame(players []Player) (*Game, error) {
	key, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}
	gamesStore[key] = &Game{
		ID:      key,
		Players: players,
	}
	games = append(games, key)
	return gamesStore[key], err
}

func GetGame(game uuid.UUID) *Game {
	return gamesStore[game]
}
func GetGames() []uuid.UUID {
	return games
}

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
		game.Lead.Conn.WriteJSON(resp)
		game.Viewer.Conn.WriteJSON(game.Questions[question])
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
	game.Viewer.Conn.WriteJSON(game.Questions)
	game.Lead.Conn.WriteJSON(game.Questions)
	return nil
}
