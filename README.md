## Deploy (Push + Remote Pull)

```bash
npm run publish-image

ssh -J g384357@100.120.26.127 g384357@192.168.1.100 'cd ~/crop-backend && docker compose pull && docker compose up -d'
```
