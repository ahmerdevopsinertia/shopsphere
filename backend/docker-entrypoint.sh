#!/bin/sh

set -e

echo "Starting ShopSphere Backend..."

echo "Running Prisma migrations..."

npx prisma migrate deploy


if [ "$RUN_SEED" = "true" ]; then

    echo "Running database seed..."

    npx prisma db seed

else

    echo "Skipping database seed..."

fi


echo "Starting NestJS application..."

node dist/src/main.js