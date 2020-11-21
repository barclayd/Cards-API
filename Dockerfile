# build and complie typescript code
FROM node:12.16.0-slim as build
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# only install non-dev dependencies
FROM node:12.16.0-slim
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
ENV NODE_ENV production

COPY --from=build /usr/app/dist ./dist

ARG DATABASE_URL
RUN /usr/app/generateEnv.sh $DATABASE_URL
EXPOSE 4000
CMD npm run start:production
