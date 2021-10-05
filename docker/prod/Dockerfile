# -- Base Node ---
FROM node:16-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./src/

# -- Build Base ---
FROM base AS build-base
COPY ["./jest.config.js", "./tsconfig.json", "./.eslintrc", "./.eslintignore", "./src/"]

# -- Dependencies Node ---
FROM build-base AS dependencies
RUN npm install --prefix ./src --production --silent

# ---- Compile  ----
FROM build-base AS server
COPY ./model ./src/model
COPY ./settings ./src/settings
COPY ./tools ./src/tools
COPY ./utils ./src/utils
COPY ./index.ts ./src/index.ts
COPY --from=dependencies /usr/src/app/src/node_modules ./src/node_modules

# ---- Release  ----
FROM server AS release
LABEL Description="A2R Server"
ENV NODE_ENV production