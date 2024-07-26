#!/bin/bash

npm run db:migrate

exec "$@"
