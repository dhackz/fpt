#!/bin/sh
docker run --rm --name=redis-cli --network=host -it redis:alpine redis-cli
