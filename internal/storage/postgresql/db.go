package postgresql

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"samat/internal/storage"
)

type Storage struct {
	db *pgxpool.Pool
}

func New(dsn string) (*Storage, error) {
	const op = "storage.postgresql.New"

	db, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = db.Exec(context.Background(),
		`CREATE TABLE IF NOT EXISTS url(
				id SERIAL PRIMARY KEY,
				alias TEXT NOT NULL UNIQUE,
				url TEXT NOT NULL);
    		`)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = db.Exec(context.Background(),
		`
			CREATE INDEX IF NOT EXISTS url_alias ON url(alias);
			`)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &Storage{db: db}, nil
}

func (s *Storage) SaveURL(urlToSave string, alias string) (int64, error) {
	const op = "storage.postgresql.SaveURL"

	var id int64
	err := s.db.QueryRow(context.Background(), `INSERT INTO url(alias, url) VALUES($1, $2) RETURNING id`, alias, urlToSave).Scan(&id)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return 0, fmt.Errorf("%s: %w", op, storage.ErrUrlExists)
		}
		return 0, fmt.Errorf("%s: %w", op, err)
	}

	return id, nil
}

func (s *Storage) GetURL(alias string) (string, error) {
	const op = "storage.postgresql.GetURL"

	var resURL string
	err := s.db.QueryRow(context.Background(), `SELECT url FROM url WHERE alias = $1`, alias).Scan(&resURL)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	if errors.Is(err, pgx.ErrNoRows) {
		return "", storage.ErrUrlNotFound
	}
	
	return resURL, nil
}

func (s *Storage) DeleteURL(alias string) error {
	const op = "storage.postgresql.DeleteURL"

	res, err := s.db.Exec(context.Background(), `DELETE FROM url WHERE alias = $1`, alias)
	if err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	if res.RowsAffected() == 0 {
		return storage.ErrUrlNotFound
	}
	return nil
}
