# -- Base Node ---
FROM node:12-alpine AS base
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

# FROM node:12-alpine
# WORKDIR /usr/src/app
# LABEL Description="A2R Server"
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent
# COPY . ./src
# RUN rm -rf ./src/server
# VOLUME ["/usr/src/app/src/server"]
# ENV NODE_ENV production
# CMD cd ./src;npm install --silent;npm run build;cp -r ./bin ../;cd ..;rm -rf ./src;rm -rf ./bin;npm start