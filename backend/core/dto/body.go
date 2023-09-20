package dto

import "github.com/google/uuid"

type SelectQuestionBody struct {
	Question uint      `json:"question"`
	Game     uuid.UUID `json:"game"`
}

type Answer struct {
	ID    uint `json:"id_player"`
	Right bool `json:"right"`
}
type AnswerQuestionBody struct {
	Game     uuid.UUID `json:"game"`
	Question uint      `json:"question"`
	Value    int       `json:"value"`
	Answers  []Answer  `json:"answers"`
}

type ReconnectBody struct {
	Game uuid.UUID `json:"game"`
	Role string    `json:"role"`
}
