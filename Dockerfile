FROM node:16.17-slim
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000

RUN chmod +x wait-for-it.sh
RUN chmod +x entry-point.sh
ENV NODE_ENV production
CMD ["./wait-for-it.sh" , "ft-strapi:1337" , "--strict" , "--timeout=300" , "--" , "sh", "./entry-point.sh"]
