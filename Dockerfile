FROM node:bullseye

RUN apt update

RUN apt install git -y

#paranoia
RUN rm -rf /foaas

RUN mkdir /fooas

#RUN git clone https://github.com/IGNNE/foaas-discord /foaas
COPY . /fooas

WORKDIR /foaas

RUN npm install -y

RUN echo "DISCORD_CLIENT_ID=1046841872519266318\nDISCORD_TOKEN=MTA0Njg0MTg3MjUxOTI2NjMxOA.GZPXLy.qaF2XKDFaMVWkl5oHmX1M9GPbALVsK9kCTI07c" > /foaas/.env

CMD npm start


