FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install 
COPY . /app
CMD node application/server/server.js
#CMD ["sh"]
EXPOSE 5000