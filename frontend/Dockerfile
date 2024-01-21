FROM node:18-alpine
RUN apk add --no-cache libc6-compat

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# USER nextjs

COPY ./package.json ./
RUN npm install

COPY ./ ./

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]