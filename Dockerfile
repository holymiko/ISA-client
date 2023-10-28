FROM node:14
WORKDIR /app
COPY package.json .
# COPY yarn.lock .
COPY tsconfig.json . 
COPY src ./src
COPY public ./public

RUN yarn install --production --ignore-engines
RUN yarn build
RUN yarn global add serve

RUN ls -la .

# Set the startup command for the container
CMD ["serve", "-s", "build"]
