#!/bin/bash

DOCKER_REGISTRY="public.ecr.aws/r7l7n8i7/acttoreact"
VERSION=$(cat ../package.json | sed -En 's/"version": "(.*)",/v\1/p' | awk '{$1=$1;print}')

echo "Version $VERSION"

DEV_IMAGE=server-dev
DEV_IMAGE_VERSION=$DEV_IMAGE:$VERSION
DEV_IMAGE_LATEST=$DEV_IMAGE:latest
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/r7l7n8i7
echo "Building $DEV_IMAGE_VERSION"
docker build --rm=false --pull -f "../docker/dev/Dockerfile" -t $DOCKER_REGISTRY/$DEV_IMAGE_VERSION -t $DOCKER_REGISTRY/$DEV_IMAGE_LATEST ../
echo "Pushing $DEV_IMAGE"
docker push "$DOCKER_REGISTRY/$DEV_IMAGE" --all-tags
echo "$DEV_IMAGE pushed"

IMAGE=server
IMAGE_VERSION=$IMAGE:$VERSION
IMAGE_LATEST=$IMAGE:latest
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/r7l7n8i7
echo "Building $IMAGE_VERSION"
docker build --rm=false --pull -f ../docker/prod/Dockerfile -t $DOCKER_REGISTRY/$IMAGE_VERSION -t $DOCKER_REGISTRY/$IMAGE_LATEST ../
echo "Pushing $IMAGE"
docker push "$DOCKER_REGISTRY/$IMAGE" --all-tags
echo "$IMAGE pushed"
