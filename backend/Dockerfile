FROM node:alpine as fpt-backend
STOPSIGNAL SIGKILL
RUN adduser -H -D fpt
COPY . /opt/backend
RUN chown -R fpt:fpt /opt/backend
WORKDIR /opt/backend
USER fpt
RUN yarn build
CMD ["yarn", "start"]
