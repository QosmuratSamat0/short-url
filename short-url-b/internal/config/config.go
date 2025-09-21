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
	defaultConfigPath := "C:/Users/samat/GolandProjects/url-shortener/short-url-b/config/local.yaml"
	if err := os.Setenv("CONFIG_PATH", defaultConfigPath); err != nil {
		log.Fatal(err)
		return nil
	}

	if _, err := os.Stat(defaultConfigPath); os.IsNotExist(err) {
		log.Fatal("CONFIG_PATH does not exist")
	}

	var cfg Config

	err := cleanenv.ReadConfig(defaultConfigPath, &cfg)
	if err != nil {
		log.Fatal(err)
	}
	return &cfg
}
