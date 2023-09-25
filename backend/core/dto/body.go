package dto

import "github.com/google/uuid"

type SelectThemeBody struct {
	Game  uuid.UUID `json:"game"`
	Theme uint      `json:"theme"`
}

type SelectQuestionBody struct {
	Game     uuid.UUID `json:"game"`
	Question uint      `json:"question"`
}

type AnswerQuestionBody struct {
	Game     uuid.UUID `json:"game"`
	Question uint      `json:"id"`
	Status   string    `json:"status"`
}

type ReconnectBody struct {
	Game uuid.UUID `json:"game"`
	Role string    `json:"role"`
}
