FROM node:8.6.0-alpine
# Use this arg to build the compiled app
ARG nodeEnv=production
# Use this arg to set prod/dev environment variables (e.g: graphql endpoint)
ARG environment=production

ENV NODE_ENV ${nodeEnv}
ENV ENVIRONMENT ${environment}

EXPOSE 3000

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/var
WORKDIR /usr/src/app

# During build, move the package.json and install dependencies
COPY app/package.json /usr/src/app
COPY app/package-lock.json /usr/src/app
RUN npm install --dev

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Now move the application
COPY app/ /usr/src/app
RUN npm run build

# If on development, we will be mounting the folder, so we need to reinstall the dependencies
CMD if [ "${NODE_ENV}" = "development" ]; then \
        npm install && touch /usr/src/var/healthy && npm run dev; \
    else \
        touch /usr/src/var/healthy \
        && npm run start \
        && tail -f /dev/null; \
    fi \
