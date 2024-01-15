package entity

import (
	"fmt"
	"math/rand"

	"github.com/Izumra/OwnGame/tools"
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type Game struct {
	ID        uuid.UUID `json:"id"`
	Title     string
	Pass      string
	Questions []Question
	Themes    []Theme
	Lead      *Client
	Viewer    *Client
	Trash     []Question
}
type SliceGame struct {
	ID     uuid.UUID `json:"id"`
	Title  string    `json:"title"`
	Lead   bool      `json:"lead"`
	Viewer bool      `json:"viewer"`
}

var gamesStore = make(map[uuid.UUID]*Game)

func GetGames() []SliceGame {
	var games []SliceGame
	for _, v := range gamesStore {
		var lead, viewer bool
		if v.Lead != nil && v.Lead.Conn != nil {
			lead = true
		}
		if v.Viewer != nil && v.Viewer.Conn != nil {
			viewer = true
		}
		games = append(games, SliceGame{v.ID, v.Title, lead, viewer})
	}
	return games
}

func CreateGame(title, pass string) (*Game, error) {
	key, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}
	gamesStore[key] = &Game{
		ID:        key,
		Pass:      pass,
		Title:     title,
		Questions: SetQuestions(),
		Themes:    SetThemes(),
	}
	return gamesStore[key], nil
}

func GetGame(game uuid.UUID) *Game {
	return gamesStore[game]
}

func DeleteGame(game uuid.UUID) {
	delete(gamesStore, game)
}

type Repository interface {
	SendResponse(interface{}) error
	AddLead(*websocket.Conn) error
	AddViewer(*websocket.Conn) error
	GetThemes() error
	GetTrashQuestion() (*Question, string)
	AnswerTrashQuestion(uint, string) error
	SelectTheme(uint) error
	SelectQuestion(uint) error
	AnswerQuestion() error
	Reconnect(*Client) (string, error)
	Connect(*Client) error
}

func (g *Game) SendResponse(response interface{}) error {
	var err, er error
	if g.Lead != nil && g.Lead.Conn != nil {
		err = g.Lead.Conn.WriteJSON(response)
	}
	if g.Viewer != nil && g.Viewer.Conn != nil {
		er = g.Viewer.Conn.WriteJSON(response)
	}
	if err != nil && er != nil {
		return fmt.Errorf("error while responsing1: %v. \n error while responsing 2: %v", err, er)
	}
	return nil
}

func (g *Game) AddLead(lead *Client) error {
	if g.Lead != nil {
		return fmt.Errorf("в игре уже есть ведущий")
	} else {
		g.Lead = lead
		return nil
	}
}

func (g *Game) AddViewer(viewer *Client) error {
	if g.Viewer != nil {
		return fmt.Errorf("в игре уже есть наблюдатель")
	} else {
		g.Viewer = viewer
		return nil
	}
}

func (g *Game) GetThemes() error {
	if err := g.SendResponse(tools.SuccessRes("get_themes", struct{ Themes []Theme }{Themes: g.Themes})); err != nil {
		return fmt.Errorf("ошибка при отправке тем - %v", err)
	}
	return nil
}

func (game *Game) GetTrashQuestion() (*Question, string) {
	if len(game.Trash) != 0 {
		el := rand.Intn(len(game.Trash))
		var answer string
		for _, va := range game.Themes {
			if va.ID == game.Trash[el].Theme {
				answer = va.Answer
				break
			}
		}
		return &game.Trash[el], answer
	}
	return nil, ""
}

func (game *Game) AnswerTrashQuestion(question uint, status string) error {
	for i, v := range game.Trash {
		if v.ID == question {
			game.Trash = append(game.Trash[:i], game.Trash[i+1:]...)
			if err := game.SendResponse(tools.SuccessRes("answer_question_trash", struct{ Questions []Question }{Questions: []Question{v}})); err != nil {
				return fmt.Errorf("ошибки при ответе на вопрос из корзины: %v", err)
			}
			return nil
		}
	}
	if err := game.SendResponse(tools.SuccessRes("answer_question_trash", fmt.Errorf("вопрос удален"))); err != nil {
		return fmt.Errorf("ошибки при отпраке ответа: %v", err)
	}
	return nil
}

func (game *Game) SelectTheme(theme uint) error {
	var theme_questions []Question
	var t Theme
	for _, v := range game.Themes {
		if v.ID == theme {
			t = v
			break
		}
	}
	for _, v := range game.Questions {
		if v.Theme == theme {
			theme_questions = append(theme_questions, v)
		}
	}
	type Resp struct {
		Questions []Question
		Answer    string
		IMGAnswer string
	}
	if err := game.SendResponse(tools.SuccessRes("select_theme", Resp{Questions: theme_questions, Answer: t.Answer, IMGAnswer: t.IMGAnswer})); err != nil {
		return fmt.Errorf("ошибка записи вопросов выбранной темы %v", err)
	}
	return nil
}

func (game *Game) SelectQuestion(question uint) error {
	var q Question
	for _, v := range game.Questions {
		if v.ID == question {
			q = v
		}
	}
	if err := game.SendResponse(tools.SuccessRes("select_question", struct{ Question Question }{Question: q})); err != nil {
		return fmt.Errorf("ошибка при ответе на вопрос: %v", err)
	}
	return nil
}

func (game *Game) AnswerQuestion(question uint, status string) error {
	var q Question
	for i, v := range game.Questions {
		if v.ID == question {
			game.Questions[i].Status = status
			q = game.Questions[i]
			break
		}
	}
	var theme_questions []Question
	var wrong_answers int
	for _, quest := range game.Questions {
		if quest.Theme == q.Theme {
			theme_questions = append(theme_questions, quest)
			if quest.Status == "failed" {
				wrong_answers++
			}
		}
	}
	for i, v := range game.Themes {
		if v.ID == q.Theme && (q.Status == "solved" || wrong_answers == len(theme_questions)) {
			if q.Status == "solved" {
				for _, v := range theme_questions {
					if v.Status == "" {
						game.Trash = append(game.Trash, v)
					}
				}
			}
			game.Themes[i].Status = q.Status
			break
		}
	}
	if err := game.SendResponse(tools.SuccessRes("answer_question", struct {
		Questions  []Question
		TrashCount int
	}{Questions: theme_questions, TrashCount: len(game.Trash)})); err != nil {
		return fmt.Errorf("ошибка при ответе на вопрос: %v", err)
	}
	return nil
}

func (game *Game) Reconnect(client *Client) (string, error) {
	if client.Role == "Lead" {
		addres := game.Lead.Address
		game.Lead = client
		if err := game.Lead.Conn.WriteJSON(tools.SuccessRes("reconnect", struct{ Themes []Theme }{Themes: game.Themes})); err != nil {
			return addres, err
		}
		return addres, nil
	} else if client.Role == "Viewer" {
		addres := game.Viewer.Address
		game.Viewer = client
		if err := game.Viewer.Conn.WriteJSON(tools.SuccessRes("reconnect", struct{ Themes []Theme }{Themes: game.Themes})); err != nil {
			return addres, err
		}
		return addres, nil
	}
	return client.Address, fmt.Errorf("неизвестная роль")
}

func (game *Game) Connect(participant *Client, pass string) error {
	if pass != game.Pass {
		return fmt.Errorf("неверный пароль от комнаты")
	}
	role := ""
	if participant.Role == "Lead" {
		role = "ведущий"
	} else if participant.Role == "Viewer" {
		role = "наблюдатель"
	}
	if participant.Role == "Lead" && (game.Lead == nil || game.Lead.Conn == nil) {
		game.Lead = participant
		game.Lead.InGame = true
		if err := game.Lead.Conn.WriteJSON(tools.SuccessRes("connect", struct {
			Themes     []Theme
			TrashCount int
		}{game.Themes, len(game.Trash)})); err != nil {
			game.Lead = nil
			return err
		}
	} else if participant.Role == "Viewer" && (game.Viewer == nil || game.Viewer.Conn == nil) {
		game.Viewer = participant
		game.Viewer.InGame = true
		if err := game.Viewer.Conn.WriteJSON(tools.SuccessRes("connect", struct {
			Themes     []Theme
			TrashCount int
		}{game.Themes, len(game.Trash)})); err != nil {
			game.Viewer = nil
			return err
		}
	} else {
		return fmt.Errorf("в игре уже есть %v", role)
	}
	return nil
}
