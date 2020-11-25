# Cards API Server

![Server CI](https://github.com/barclayd/Cards-API/workflows/Server%20CI/badge.svg?branch=main)
![Server CD](https://github.com/barclayd/Cards-API/workflows/Server%20CD/badge.svg?branch=main)
![Deployment Status](https://img.shields.io/badge/Deployed-live-blue)

Server for cards API. Built using Typescript, type-graphql and Apollo Server.

[Deployed live!](https://cards-test-api.herokuapp.com/graphql)

### Features

- Node.js server that offers a GraphQL API to retrieve card previews and cards for a specified cardId and size
- Full [CI Pipeline](https://github.com/barclayd/Cards-API/actions?query=workflow%3A%22Server+CI%22) using GitHub Actions to run unit and integration tests against each commit on a PR to main branch
- Full [CD Pipeline](https://github.com/barclayd/Cards-API/actions?query=workflow%3A%22Server+CD%22) to install dependencies, build and deploy the project to Heroku on each merge to main branch
- GraphQL playground to interact with API
- Integrates Redis cache to improve API performance and response times
- Deployed live to Heroku
- Runnable locally and within Docker and Docker Compose
- Service layer architecture to encapsulate business logic, improve quality of testing through dependency injection and for flexibility for future changes
- A large suite of unit and integration tests with high code coverage to give confidence in code quality and deployment

### Architecture

### Decisions behind Tech Stack

- GraphQL used to abstract complexity from traditional REST APIs. Provides a schema that can be consumed by a client to provide rich typings. Gives flexibility to frontend to consume as much data as it requires for business logic, preventing over-fetching and under-fetching
- Type-graphql used to allow seamless schema definition via easy to read decorators, defining entities to create concrete types of entities to return via GraphQL
- Redis is used as an in-memory data caching store to reduce data latency and improve API response times, caching external dependencies. Redis is extremely fast and very simple to integrate into the project

GraphQL was chosen following the approval of Claire Reed to highlight the benefits of a GraphQL API over traditional REST as discussed during the interview.

### Performance

In order to improve API performance and response time, [Redis](https://redis.io/) was selected as an open-source in-memory data store to cache both resolvers and external network calls.
The assumption was made that a suitable cache `timeToLive` was 2 hours. Therefore, if a query is made that does not exist in Redis cache, the server does the relevant network calls and processes the data and stores the result in Redis before returning it to the user.
This massively reduces the response time for repeat queries or requesting other resources that rely on the same external network calls.
For a repeat request, the server can now serve the data straight from Redis cache, as long as the cache is still valid, avoiding additional overheads of extra network calls and calculation.
Cached results are invalidated after 2 hours to ensure that up-to-date data for resources such as prices or templates that may have changed can be used.

The following table displays the performance impact of no cache vs cache only network calls vs cache resolver and network calls.

|              Query              | Response Time (no cache) | Response Time (cache external network calls only) | Response Time (cache resolver and external network calls) |
| :-----------------------------: | :----------------------: | :-----------------------------------------------: | :-------------------------------------------------------: |
|             cards()             |          189ms           |                      0.618ms                      |                          0.110ms                          |
| card(id: "card001", size: "gt") |          246ms           |                      0.950ms                      |                          0.124ms                          |

### How to set up project locally

_Please note to run the project locally, it requires a local instance of Redis to be running on its default port 6379_

To verify if you have Redis running locally, the following command should return `PONG`:

```shell script
redis-cli ping
```

```shell script
git clone https://github.com/barclayd/Cards-API.git
cd Cards-API
npm install
npm run setup:dev
```

This will generate a `.env` file ready for you to begin running the project. Please note the `.env` file must be present in order to run the project.

### How to run in development mode

If you don't have Redis installed or running locally, please visit [How to run with Docker Compose](https://github.com/barclayd/Cards-API/README#How-to-run-with-Docker-Compose)

```shell script
npm run start:dev
```

Once the development server is up and running, you can navigate to `http://localhost:4000/graphql` to interact with a GraphQL playground.
This allows you to execute queries and view the data they return, as you would expect when making requests via an HTTP request.

### Verify the correct response for cards query

##### Using GraphQL playground

Please navigate to `https://cards-test-api.herokuapp.com/graphql` or if running locally `localhost:4000/graphql` to launch the GraphQL playground.
Inside the interactive editor paste the following query:

```graphql
query CardsQuery {
  cards {
    title
    imageUrl
    url
  }
}
```

Then run the query to verify that the correct JSON output is provided:

```json
{
  "data": {
    "cards": [
      {
        "title": "card 1 title",
        "imageUrl": "/front-cover-portrait-1.jpg",
        "url": "/cards/card001"
      },
      {
        "title": "card 2 title",
        "imageUrl": "/font-cover-portrait-2.jpg",
        "url": "/cards/card002"
      },
      {
        "title": "card 3 title",
        "imageUrl": "/front-cover-landscape.jpg",
        "url": "/cards/card003"
      }
    ]
  }
}
```

##### Using the terminal

If running locally, execute the following against `http://localhost:4000/graphql` instead of the live deployed link referenced in the examples below.
Run the following commands in your `command prompt` or `terminal`

````shell script
curl 'https://cards-test-api.herokuapp.com/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: https://cards-test-api.herokuapp.com' --data-binary '{"query":"query CardsQuery {\n  cards {\n    title\n    imageUrl\n    url\n  }\n}"}' --compressed```
````

### Verify the correct response for card query

##### Using GraphQL playground

Please navigate to `https://cards-test-api.herokuapp.com/graphql` or if running locally `localhost:4000/graphql` to launch the GraphQL playground.
Inside the interactive editor paste the following query:

```graphql
query CardQuery($id: String!, $size: SizeOption) {
  card(input: { cardId: $id, size: $size }) {
    title
    size
    availableSizes {
      id
      title
    }
    imageUrl
    price
    pages {
      title
      width
      height
      imageUrl
    }
  }
}
```

Then click `Query Variables` on the bottom left-hand corner of the page to add values for the variables referenced in the query:
Copy and paste the following:

```json
{
  "id": "card001",
  "size": "gt"
}
```

Then run the query to verify that the correct JSON output is provided:

```json
{
  "data": {
    "card": {
      "title": "card 1 title",
      "size": "gt",
      "availableSizes": [
        {
          "id": "sm",
          "title": "Small"
        },
        {
          "id": "md",
          "title": "Medium"
        },
        {
          "id": "gt",
          "title": "Giant"
        }
      ],
      "imageUrl": "/front-cover-portrait-1.jpg",
      "price": "£4.00",
      "pages": [
        {
          "title": "Front Cover",
          "width": 300,
          "height": 600,
          "imageUrl": "/front-cover-portrait-1.jpg"
        },
        {
          "title": "Inside Left",
          "width": 300,
          "height": 600,
          "imageUrl": ""
        },
        {
          "title": "Inside Right",
          "width": 300,
          "height": 600,
          "imageUrl": ""
        },
        {
          "title": "Back Cover",
          "width": 300,
          "height": 600,
          "imageUrl": "/back-cover-portrait.jpg"
        }
      ]
    }
  }
}
```

##### Using the terminal

If running locally, execute the following against `http://localhost:4000/graphql` instead of the live deployed link referenced in the examples below.
Run the following commands in your `command prompt` or `terminal`

```shell script
curl 'https://cards-test-api.herokuapp.com/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: https://cards-test-api.herokuapp.com' --data-binary '{"query":"query CardQuery($id:String!, $size: SizeOption) {\n  card(input: {\n    cardId: $id,\n    size: $size\n  }) {\n    title\n    size\n    availableSizes {\n      id\n      title\n    }\n    imageUrl\n    price\n    pages {\n      title\n      width\n      height\n      imageUrl\n    }\n  }\n}","variables":{"id":"card001","size":"gt"}}' --compressed
```

### How to run tests

If you do not a Redis instance running locally, please visit [How to run tests using Docker Compose](https://github.com/barclayd/Cards-API/README#How-to-run-tests-with-Docker-Compose)

##### Unit tests

```shell script
npm run test:unit
```

##### Integration tests

```shell script
npm run test:integration
```

### How to build project

```shell script
npm run build
```

### How to run using Docker Compose

Run the following command to spin up a Docker container that has access to a Redis instance:

```shell script
npm run start:docker https://moonpig.github.io/tech-test-node-backend
docker-compose run --service-ports server npm run start:dev
```

This will expose map port `4000` on your local machine to the Docker container, allowing you to access the GraphQL playground on `http://localhost:4000/graphql`

### How to close Docker Compose

```shell script
docker-compose down
```

### How to run tests with Docker Compose

**Ensure that you have the Docker Daemon running on your machine**

```shell script
npm run start:docker https://moonpig.github.io/tech-test-node-backend
```

This will setup a Docker Compose environment ready to run any actions against the project

#### Unit tests

Ensuring that you have run `npm run start:docker`, run the following:

```shell script
docker-compose run server npm run test:unit
```

#### Integration tests

Ensuring that you have run `npm run start:docker`, run the following:

```shell script
docker-compose run server npm run test:integration
```

### How to generate GraphQL schema for a client to consume

To produce a `schema.graphql` file ready to be consumed by a frontend client for full typesafe support of the API, run the following command:

```shell script
npm run generate:schema
```

### CI-CD Pipeline

- GitHub Actions is in operation as a CI-CD pipeline to verify the passing of unit and integration tests on each push in a PR branch to `main` and to deploy commits into the `main` branch
- GitHub Actions has been chosen due to its simple integration with GitHub repositories, simple `YAML` syntax and that is it free for open source projects

### Future Improvements

If I had more time, I would like to make the following improvements to the project:

- Authorisation for API calls
- Improved dependency injection across all services
- Develop a REST-like API using `swagger-node` for a Swagger-complaint API. This could be done very easily and with minimal code changes due to the service layer architecture pattern implemented.
