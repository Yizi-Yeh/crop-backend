# Publish Image Script Design

## Goal
Provide a single manual command to build and push a multi-platform Docker image for this project.

## Scope
- Build and push `linux/amd64` and `linux/arm64` images.
- Default image tag `g384357/crop-backend:latest`.
- Allow overrides via environment variables.
- Basic validation and clear errors.

## Proposed Interface
- Script: `scripts/publish-image.sh`
- Usage:
  - `./scripts/publish-image.sh`
  - `IMAGE_TAG=... PLATFORMS=... ./scripts/publish-image.sh`

## Behavior
1. Check `docker` CLI availability.
2. Ensure a buildx builder exists (create and select if missing).
3. Run `docker buildx build --platform ... -t ... --push .`.
4. Print the tag and platforms on success.

## Error Handling
- If Docker is unavailable, exit with a clear message.
- If buildx fails, exit non-zero and surface the error output.

## Non-Goals
- No automatic remote deploy.
- No git hooks or auto-trigger on file changes.
