package graph

import (
	"github.com/sasha-s/go-deadlock"
	"github.com/vicsnow/gqlgen-todos/graph/model"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DriveChan chan []*model.GuiDriveDraw
	subCount  int
	deadlock.RWMutex
}
