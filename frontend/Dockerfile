FROM node:14-alpine as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .
EXPOSE 3000

RUN npm run build 

FROM nginx:1.12-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]