#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${IMAGE_TAG:-g384357/crop-backend:latest}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"
BUILDER="${BUILDER:-crop-backend-builder}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found." >&2
  exit 1
fi

if ! docker buildx version >/dev/null 2>&1; then
  echo "Error: docker buildx is not available." >&2
  exit 1
fi

if ! docker buildx inspect "$BUILDER" >/dev/null 2>&1; then
  docker buildx create --name "$BUILDER" --use >/dev/null
else
  docker buildx use "$BUILDER" >/dev/null
fi

docker buildx build \
  --platform "$PLATFORMS" \
  -t "$IMAGE_TAG" \
  --push \
  .

echo "Pushed: $IMAGE_TAG"
echo "Platforms: $PLATFORMS"
