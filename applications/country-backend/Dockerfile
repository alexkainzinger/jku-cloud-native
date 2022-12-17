FROM node:18-alpine as builder

COPY package.json ./
COPY yarn.lock ./
COPY src ./src
COPY tsconfig.json ./tsconfig.json

RUN yarn install && yarn build

# second stage containing only necessary files & directories
FROM node:18-alpine

COPY --from=builder ./node_modules ./node_modules
COPY --from=builder /dist /dist

EXPOSE 8081
CMD ["dist/index.js"]
