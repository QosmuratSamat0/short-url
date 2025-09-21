package redirect

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

type URLGetter interface {
	GetURL(alias string) (string, error)
}

func New(log *slog.Logger, urlGetter URLGetter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const op = "handlers.redirect.New"
		log = log.With(
			"op", op,
			"request_id", middleware.GetReqID(r.Context()),
		)

		alias := chi.URLParam(r, "alias")
		if alias == "" {
			log.Info("alias is empty")

			render.JSON(w, r, resp.Error("not found"))

			return
		}

		origURL, err := urlGetter.GetURL(alias)
		if errors.Is(err, storage.ErrUrlNotFound) {
			log.Error("alias not found", slog.String("alias", alias))

			render.JSON(w, r, resp.Error("not found"))

			return
		}

		if err != nil {

			log.Error("failed to get URL", slog.String("error", err.Error()))

			render.JSON(w, r, resp.Error("internal error"))

			return
		}

		log.Info("got url", slog.String("url", origURL))

		http.Redirect(w, r, origURL, http.StatusFound)

	}
}
