Example systemd environment file (config.env):

```
# Absolute path to prod config
CONFIG_PATH=/home/mathalama_kz/apps/url-shortener/short-url-b/config/prod.yaml

# BasicAuth password for admin endpoints
HTTP_SECRET_PASSWORD=change_me_strong_password
```

Notes:
- Ensure the backend binary runs with a WorkingDirectory where relative CONFIG_PATH works, or set an absolute CONFIG_PATH as above.
- The backend listens on the port from the config file. Align Nginx proxy_pass to the same port.

//url-shortener projectgit push 