# STAGE 1
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["node","-e","fetch('http://127.0.01:3000/health').then(r=>process.exit(r.ok ? 0 : 1)).catch(()=>process.exit(1))"]
CMD [ "node", "dist/server.js" ]
