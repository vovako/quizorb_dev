package entity

import (
	"fmt"

	"github.com/Izumra/OwnGame/tools"
	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type Game struct {
	ID        uuid.UUID `json:"id"`
	Questions []Question
	Themes    []Theme
	Lead      *Client
	Viewer    *Client
}

var gamesStore = make(map[uuid.UUID]*Game)

func CreateGame() (*Game, error) {
	key, err := uuid.NewUUID()
	if err != nil {
		return nil, err
	}
	gamesStore[key] = &Game{
		ID:        key,
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
	GetThemes() error
	SelectTheme(uint) error
	SelectQuestion(uint) error
	AnswerQuestion() error
	Reconnect(*Client) error
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

func (game *Game) GetThemes() error {
	err := game.Lead.Conn.WriteJSON(tools.SuccessRes("get_themes", struct{ Themes []Theme }{Themes: game.Themes}))
	er := game.Viewer.Conn.WriteJSON(tools.SuccessRes("get_themes", struct{ Themes []Theme }{Themes: game.Themes}))
	if err != nil || er != nil {
		return fmt.Errorf("ошибка при отправке тем наблюдателю - %v, ведущему - %v", er, err)
	}
	return nil
}

func (game *Game) SelectTheme(theme uint) error {
	var theme_questions []Question
	var t Theme
	for _, v := range game.Themes {
		if v.ID == theme && v.Status != "" {
			er := game.Lead.Conn.WriteJSON(tools.SuccessRes("select_theme", tools.BadRes("select_theme", fmt.Errorf("тема уже разгадана"))))
			if er != nil {
				return er
			}
			return fmt.Errorf("данная тема уже разгадана")
		} else if v.ID == theme {
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
	err := game.Viewer.Conn.WriteJSON(tools.SuccessRes("select_theme", Resp{Questions: theme_questions, Answer: t.Answer, IMGAnswer: t.IMGAnswer}))
	er := game.Lead.Conn.WriteJSON(tools.SuccessRes("select_theme", Resp{Questions: theme_questions, Answer: t.Answer, IMGAnswer: t.IMGAnswer}))
	if err != nil || er != nil {
		return fmt.Errorf("ошибка записи вопросов выбранной темы, на наблюдателе - %v, на ведущем - %v", err, er)
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
	if q.Status == "" {
		err := game.Lead.Conn.WriteJSON(tools.SuccessRes("select_question", struct{ Question Question }{Question: q}))
		er := game.Viewer.Conn.WriteJSON(tools.SuccessRes("select_question", struct{ Question Question }{Question: q}))
		if err != nil || er != nil {
			return fmt.Errorf("ошибка при ответе ведущему: %v, ошибка при ответе зрителям: %v", err, er)
		}
		return nil
	}
	return fmt.Errorf("выбранный вопрос уже решен")
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
	for _, v := range game.Questions {
		if v.Theme == q.Theme {
			theme_questions = append(theme_questions, v)
			if v.Status == "failed" {
				wrong_answers++
			}
		}
	}
	for i, v := range game.Themes {
		if v.ID == q.Theme {
			if q.Status == "solved" || wrong_answers == len(theme_questions) {
				game.Themes[i].Status = q.Status
				break
			}
		}
	}
	er := game.Viewer.Conn.WriteJSON(tools.SuccessRes("answer_question", struct{ Questions []Question }{Questions: theme_questions}))
	err := game.Lead.Conn.WriteJSON(tools.SuccessRes("answer_question", struct{ Questions []Question }{Questions: theme_questions}))
	if err != nil || er != nil {
		return fmt.Errorf("ошибка при ответе ведущему: %v, ошибка при ответе зрителям: %v", err, er)
	}
	return nil
}

func (game *Game) Reconnect(client *Client) error {
	if client.Role == "Lead" {
		game.Lead = client
		client.InGame = true
		if err := game.Lead.Conn.WriteJSON(tools.SuccessRes("reconnect", struct{ Themes []Theme }{Themes: game.Themes})); err != nil {
			return err
		}
		return nil
	} else if client.Role == "Viewer" {
		game.Viewer = client
		client.InGame = true
		if err := game.Viewer.Conn.WriteJSON(tools.SuccessRes("reconnect", struct{ Themes []Theme }{Themes: game.Themes})); err != nil {
			return err
		}
		return nil
	}
	return fmt.Errorf("неизвестная роль")
}
