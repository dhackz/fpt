FROM node:alpine as builder
ARG REACT_APP_API_URL="http://localhost"
ENV REACT_APP_API_URL=$REACT_APP_API_URL
WORKDIR /tmp/frontend
COPY yarn.lock /tmp/frontend/
COPY package.json /tmp/frontend/
RUN yarn install
COPY . /tmp/frontend
RUN yarn build

FROM nginx:alpine
COPY --from=builder /tmp/frontend/build /usr/share/nginx/html
