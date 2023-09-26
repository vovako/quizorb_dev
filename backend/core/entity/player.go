package entity

import (
	"github.com/gofiber/contrib/websocket"
)

type Player struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	IsActive bool
	Score    int
}

type Client struct {
	Address string
	Conn    *websocket.Conn
	InGame  bool
	Role    string
}