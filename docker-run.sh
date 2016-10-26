#!/bin/sh

docker build -t rdbs-ui-prototype .
docker run --publish 9000:9000 --name rdbs-ui --rm rdbs-ui-prototype