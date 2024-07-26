<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./images/banner-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./images/banner-light.png">
  <img src="./images/banner-dark.png">
</picture>

Gameday provides `m3u8` and `epg` files from MLB.TV, allowing you to watch live MLB games in your preferred player, ensuring you never miss a moment of the action. *You must have a valid [MLB.TV](https://mlb.tv) subscription to use this package, blackout rules apply.*

[![Publish](https://github.com/nicholasodonnell/gameday/actions/workflows/publish.yml/badge.svg)](https://github.com/nicholasodonnell/gameday/actions/workflows/publish.yml)

## Features

- **MLB.TV Integration:** Integrate with your existing [MLB.TV](https://mlb.tv) subscription (blackout rules apply)
- **M3U8 Playlist:** A M3U8 file for every MLB team's game (including pre and post game shows)
- **M3U Playlist:** A M3U file that combines all teams into a single playlist
- **Electronic Program Guide:** An EPG file with guide data 7 days into the future
- **Adjustable Bitrate:** Customize the streaming quality to fit your data preference
- **Timezone Support:** Ensure game times are always accurate for your location

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [MLB.TV](https://mlbtv.com) subscription

### Installation

1. Set your config options including your MLB.TV credentials using the [environment variables](#environment-variables) below.
2. Start the container using the [Docker](#docker) or [Docker Compose](#docker-compose) examples.
3. Use the [provided URLs](#urls) to access the M3U8 playlist, EPG file, and team-specific playlists.

### Example

> :exclamation: Be sure to replace `/path/to/config` in the below examples with a valid host directory path.

#### Docker

```console
docker run -d \
  -e MLB_USERNAME=your-mlb-username \
  -e MLB_PASSWORD=your-mlb-password \
  -e TZ=America/New_York \
  -p 3000:3000 \
  -v /path/to/config:/app/config \
  --restart unless-stopped \
  nicholasodonnell/gameday:latest
```

#### Docker Compose

```yaml
services:
  gameday:
    image: nicholasodonnell/gameday:latest
    container_name: gameday
    environment:
      - MLB_USERNAME=your-mlb-username
      - MLB_PASSWORD=your-mlb-password
      - TZ=America/New_York
    ports:
      - 3000:3000
    volumes:
      - /path/to/config:/app/config
    restart: unless-stopped
```

## Resources

### URLs

| URL                    | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `/playlist.m3u`        | M3U playlist for all MLB teams                                                                   |
| `/playlist/:team.m3u8` | M3U8 playlist for a specific [MLB team](https://mlb10theshow.fandom.com/wiki/Team_Abbreviations) |
| `/epg.xml`             | Electronic Program Guide                                                                         |

### Environment Variables

| Name           | Description                                                                          | Default                 |
| -------------- | ------------------------------------------------------------------------------------ | ----------------------- |
| `MLB_USERNAME` | MLB.TV username                                                                      | **Required**            |
| `MLB_PASSWORD` | MLB.TV password                                                                      | **Required**            |
| `APP_URL`      | URL of the application (will be used as the base URL when generating playlist files) | `http://localhost:3000` |
| `BITRATE`      | Bitrate of the stream (192, 450, 800, 1200, 1800, 2500, 3500, 5600)                  | `5600`                  |
| `LOG_LEVEL`    | Log level (fatal, error, warn, info, debug, trace)                                   | `info`                  |
| `TZ`           | [Your timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)   | `UTC`                   |

## Development

1. Set up the project for local dev by running:
    ```console
    ./setup-dev.sh
    ```
2. Start the project by running:
    ```console
    docker compose up
    ```

### Commands

| Command                          | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `npm run lint`                   | Lint the project                                    |
| `npm run db:migrate`             | Run database migrations                             |
| `npm run db:migrate:make <name>` | Create a new database migration with the given name |
| `npm run db:rollback`            | Rollback latest database migration                  |
