FROM node:18-alpine as builder

COPY . .
RUN yarn install && yarn build

# second stage containing only necessary files & directories
FROM nginx:1.23-alpine

# copy build folder into default web server folder
COPY --from=builder /dist /usr/share/nginx/html
