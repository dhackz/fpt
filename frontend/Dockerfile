FROM node:alpine as builder
WORKDIR /tmp/frontend
COPY yarn.lock /tmp/frontend/
COPY package.json /tmp/frontend/
RUN yarn install
COPY . /tmp/frontend
RUN yarn build

FROM nginx:alpine
COPY --from=builder /tmp/frontend/build /usr/share/nginx/html
