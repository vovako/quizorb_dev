package service

import (
	"encoding/json"

	"github.com/Izumra/OwnGame/core/dto"
)

func ValidateBody[Body dto.AnswerQuestionBody | dto.ReconnectBody | dto.SelectQuestionBody](body Body, data json.RawMessage) *Body {
	if err := json.Unmarshal(data, &body); err != nil {
		return &body
	}
	return nil
}
