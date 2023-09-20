package tools

import "github.com/gofiber/fiber/v2"

func BadRes(code int, err error) *fiber.Map {
	return &fiber.Map{
		"code":  code,
		"error": err.Error(),
		"data":  nil,
	}
}

func SuccessRes(data interface{}) *fiber.Map {
	return &fiber.Map{
		"code":  200,
		"error": nil,
		"data":  data,
	}
}
