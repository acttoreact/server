# -- Base Node ---
FROM node:16-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# -- Build Base ---
FROM base AS build-base
COPY ["./jest.config.js", "./tsconfig.json", "./.eslintrc", "./.eslintignore", "./"]

# -- Dependencies Node ---
FROM build-base AS dependencies
RUN npm install

# ---- Compile  ----
FROM build-base AS server
COPY ./model ./model
COPY ./settings ./settings
COPY ./tools ./tools
COPY ./utils ./utils
COPY ./index.ts ./index.ts
RUN mkdir ./server
RUN mkdir ./server/api
RUN mkdir ./server/model
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# ---- Release  ----
FROM server AS release
LABEL Description="A2R Server"
ENV ambient dev