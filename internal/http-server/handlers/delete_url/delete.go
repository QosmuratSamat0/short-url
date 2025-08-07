package delete_url

import (
	"errors"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"log/slog"
	"net/http"
	resp "samat/internal/lib/api/response"
	"samat/internal/storage"
)

type URLDelete interface {
	DeleteURL(alias string) error
}

func New(log *slog.Logger, urlDelete URLDelete) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.delete_url.New()"

		log.With(
			"op", op,
			"request_id", middleware.GetReqID(r.Context()),
		)

		alias := chi.URLParam(r, "alias")
		if alias == "" {
			log.Error("alias is empty", slog.String("alias", alias))

			render.JSON(w, r, resp.Error("not found"))

			return
		}

		err := urlDelete.DeleteURL(alias)

		if errors.Is(err, storage.ErrUrlNotFound) {
			log.Error("url not found", slog.String("alias", alias))

			render.JSON(w, r, resp.Error("not found"))

			return
		}
		if err != nil {
			log.Error("failed to delete_url url", slog.String("alias", alias), slog.String("error", err.Error()))

			render.JSON(w, r, resp.Error("internal error"))
		}

		log.Info("deleted", slog.String("alias", alias))

		render.JSON(w, r, resp.OK())
	}
}
