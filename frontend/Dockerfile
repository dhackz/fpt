FROM node:alpine as builder
COPY . /tmp/frontend
WORKDIR /tmp/frontend
RUN yarn install && yarn build

FROM nginx:alpine
COPY --from=builder /tmp/frontend/build /usr/share/nginx/html
