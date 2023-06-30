#!/bin/bash

# check if docker is installed
FILE=`echo \`which docker\``
if [ ! -f "$FILE" ]; then
    echo "Docker is not installed, please install it before continue."
    exit 1
fi

# pull postgres docker image / start postgres docker container
docker stop harmonypay
docker rm harmonypay
echo "Installing and running postgres docker image..."
docker pull postgres
docker run --name harmonypay -e POSTGRES_PASSWORD=harmonypay -p 5432:5432 -d postgres
echo "Postgres docker image installed and running."
echo "------------------"
echo "DB NAME: harmonypaydb"
echo "DB USER: postgres"
echo "DB PASSWORD: harmonypay"
echo "DB PORT: 5432"
echo "------------------"
sleep 6
# create harmonypay database
echo "Building harmonypay database..."
docker exec -i harmonypay psql -U postgres -c "CREATE DATABASE harmonypaydb;"
cat ./utils/db.sql | docker exec -i harmonypay psql -U postgres -d harmonypaydb
sleep 3
docker restart harmonypay
echo "Harmonypay database setup complete."
