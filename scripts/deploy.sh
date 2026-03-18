#!/usr/bin/env bash
# 建置 image 並透過 scp 部署到遠端，使用 docker compose 管理
set -euo pipefail

JUMP_HOST="${JUMP_HOST:-g384357@100.120.26.127}"
TARGET_HOST="${TARGET_HOST:-g384357@192.168.1.100}"
IMAGE_NAME="${IMAGE_NAME:-g384357/crop-backend:latest}"
TMP_FILE="/tmp/crop-backend.tar.gz"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found." >&2
  exit 1
fi

echo "建置 Docker image (linux/amd64)..."
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

echo "匯出 image..."
docker save "$IMAGE_NAME" | gzip > "$TMP_FILE"

echo "傳送 image 到目標機..."
scp -o ProxyJump="$JUMP_HOST" "$TMP_FILE" "$TARGET_HOST:/tmp/"

echo "部署中..."
ssh -J "$JUMP_HOST" "$TARGET_HOST" << 'EOF'
  docker load < /tmp/crop-backend.tar.gz
  cd ~/crop-backend && docker compose up -d
  rm /tmp/crop-backend.tar.gz
  docker image prune -f
  echo "部署完成"
EOF

rm "$TMP_FILE"
echo "完成"
