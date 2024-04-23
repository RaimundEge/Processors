FROM node:latest
ENV TZ=America/Chicago
WORKDIR /workdir/
COPY . .
RUN npm install
CMD [ "node", "app.js" ]
EXPOSE 3000
