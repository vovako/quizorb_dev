package tools

import (
	"github.com/gofiber/fiber/v2"
)

func BadRes(action string, err error) *fiber.Map {
	return &fiber.Map{
		"action": action,
		"data":   nil,
		"error":  err.Error(),
	}
}

func SuccessRes(action string, data interface{}) *fiber.Map {
	return &fiber.Map{
		"action": action,
		"data":   data,
		"error":  nil,
	}
}
