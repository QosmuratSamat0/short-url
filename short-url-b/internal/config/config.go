package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"log"
	"os"
	"time"
)

type Config struct {
	Env         string `yaml:"env" env-default:"local"`
	StoragePath string `yaml:"storage_path" env-required:"true"`
	DatabaseURL string `yaml:"database_url"`
	HTTPServer  `yaml:"http-server" env-required:"true"`
	//Database    `yaml:"database" env-required:"true"`
}

type HTTPServer struct {
	Address     string        `yaml:"address" env-default:"localhost:8010"`
	Timout      time.Duration `yaml:"timeout" env-default:"4s"`
	IdleTimeout time.Duration `yaml:"idle_timeout" env-default:"60s"`
	User        string        `yaml:"user" env-required:"true"`
	Password    string        `yaml:"password" env-required:"true" env:"HTTP_SECRET_PASSWORD"`
}

func MustLoad() *Config {
    // Prefer CONFIG_PATH from environment; fallback to a relative prod config
    configPath, ok := os.LookupEnv("CONFIG_PATH")
    if !ok || configPath == "" {
        configPath = "./short-url-b/config/prod.yaml"
    }

    if _, err := os.Stat(configPath); os.IsNotExist(err) {
        log.Fatalf("config file not found: %s", configPath)
    }

    var cfg Config

    if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
        log.Fatal(err)
    }
    return &cfg
}
