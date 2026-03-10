#!/usr/bin/env bash
# 多平台映像建置與推送腳本（使用 buildx）
set -euo pipefail

# 可用環境變數覆寫預設值
IMAGE_TAG="${IMAGE_TAG:-g384357/crop-backend:latest}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"
BUILDER="${BUILDER:-crop-backend-builder}"

# 檢查 docker CLI 是否存在
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found." >&2
  exit 1
fi

# 檢查 buildx 是否可用
if ! docker buildx version >/dev/null 2>&1; then
  echo "Error: docker buildx is not available." >&2
  exit 1
fi

# 確保 builder 存在並切換到該 builder
if ! docker buildx inspect "$BUILDER" >/dev/null 2>&1; then
  docker buildx create --name "$BUILDER" --use >/dev/null
else
  docker buildx use "$BUILDER" >/dev/null
fi

# 建置多平台映像並推送到 registry
docker buildx build \
  --platform "$PLATFORMS" \
  -t "$IMAGE_TAG" \
  --push \
  .

# 輸出結果
echo "Pushed: $IMAGE_TAG"
echo "Platforms: $PLATFORMS"
