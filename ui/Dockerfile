FROM node:9
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install react-scripts -g 
COPY . /app
CMD npm start
EXPOSE 3000