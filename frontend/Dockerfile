FROM node:18-alpine
RUN apk add --no-cache libc6-compat

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# USER nextjs

COPY ./package.json ./
RUN npm install
RUN npm install -g vite

COPY ./ ./

RUN vite build

EXPOSE 4173

CMD ["vite", "preview", "--host"]