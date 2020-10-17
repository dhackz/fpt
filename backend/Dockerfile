FROM node:alpine as fpt-backend
RUN adduser -H -D fpt
COPY backend /opt/backend
RUN chown -R fpt:fpt /opt/backend
RUN ls /opt/backend -al
WORKDIR /opt/backend
USER fpt
RUN yarn build
CMD ["yarn", "start"]
