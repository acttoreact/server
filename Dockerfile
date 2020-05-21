FROM node:12-alpine
WORKDIR /usr/src/app
LABEL Description="A2R Server"
COPY . .
RUN rm -rf ./server
RUN npm install --silent
VOLUME ["/usr/src/app/server"]
CMD npm run dev