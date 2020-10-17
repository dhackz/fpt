FROM node:alpine as builder
ARG REACT_APP_API_URL="http://localhost"
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY . /tmp/frontend
WORKDIR /tmp/frontend
RUN yarn install && yarn build

FROM nginx:alpine
COPY --from=builder /tmp/frontend/build /usr/share/nginx/html
