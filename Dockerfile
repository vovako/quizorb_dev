FROM node:20-alpine

WORKDIR /quizorb

COPY ["package.json","./"]

EXPOSE 3000

RUN npm i

COPY . .

CMD ["npm","run","dev"]