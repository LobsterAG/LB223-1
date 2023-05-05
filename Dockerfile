FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]
EXPOSE 4200