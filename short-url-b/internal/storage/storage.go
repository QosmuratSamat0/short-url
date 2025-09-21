package storage

import "errors"

var (
	ErrUrlNotFound = errors.New("not found")
	ErrUrlExists   = errors.New("url exists")
)
