# App Documentation

The App is a status monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed reports about their URL metrics.

## Categories

- [Middlewares](#middlewares).
- [API Endpoints](#api-endpoints).
  - [User APIs](#user-apis).
  - [URL APIs](#url-apis).
- [Docker container](#docker-containers).
- [Testing](#testing).

## Middlewares

Middlewares are functions that are executed before the route handlers in the application to perform additional operations such as authentication, validation, etc..

- **validateSignupData**:
  
  validates the signup data ensuring that the data meets the required criteria before proceeding with the signup process.

- **validateLoginData**:
  
  validates the login data ensuring that the data meets the required criteria before proceeding with the login process.
  
- **validateToken**:
  
  verifies the existance and validates the token provided in the request.
  
- **validateURLData**:
  
  validates the URL data submitted in the request body to ensures it follows the url model.
  
- **validateAuth**:
  
  validates the user's access to a specific URL.
  
## API Endpoints

The APIs follows its route, every route consists of middlewares (for validation and authorization) and a route handler (controller).

### User APIs

- `POST: /user/signup`:
  
   Registers a new user with the provided signup data after validation, Example:

   Request body:

   ```json
    {
    "name": "ahmed",
    "email": "ah.elsharkawye@gmail.com",
    "password": "123456"
    }
   ```

   Response:

   ```json
    {
    "message": "User added successfully"
    }
   ```

- `POST: /user/login`:
  
  Authenticates the user with the provided login credentials by responding with a JWT in the headers, Example:

   Request body:

   ```json
    {
    "name": "ahmed",
    "email": "ah.elsharkawye@gmail.com",
    }
   ```

    Response body:

   ```json
    {
    "message": "Logged in Successfully"
    }
   ```

   and `x-auth-token` is provided in the response headers.

### URL APIs

- `POST: /url`:
  
  Adds a new URL for the authenticated user, Example:

    Request body:

   ```json
    {
    "link": "https://fakestoreapi.com/products/1",
    "tag": "t2"
    }
   ```

   and `x-auth-token` is provided in the request header.

   Response:

   ```json
    {
    "message": "URL added successfully and monitoring started"
    }
   ```

- `GET: /url/metrics`:
  
  Retrieves the metrics (report) for a specific URL owned by the authenticated user, Example:

  Request:

  ```text
  GET: http://localhost:7000/url/metrics?link='https%3A%2F%2Ffakestoreapi.com%2Fproducts%2F1'
  ```

  and `x-auth-token` is provided in the request header.

  Response:

    ```json
    "message": "URL found",
    "url": {
        "_id": "646c873058b5736fc63a604a",
        "link": "https://fakestoreapi.com/products/1",
        "userID": "6467ca2743bdde9bf9f45b97",
        "status": "up",
        "downtime": 0,
        "uptime": 0,
        "requests_count": 1,
        "outages": 0,
        "total_response_time": 2474,
        "tag": "t2",
        "history": [
            {
                "timestamp": "2023-05-23T09:28:16.619Z",
                "status": "up",
                "_id": "646c873358b5736fc63a604e"
            }
        ],
        "__v": 0
    }
   ```

- `GET: /url/all`:
  
  Retrieves all URLs owned by the authenticated user, Example:

  Request:

  `x-auth-token` is provided in the request header.

    Response:

    ```json
    "message": "Your URLs",
    "urls": [
        {
        "_id": "646c873058b5736fc63a604a",
        "link": "https://fakestoreapi.com/products/1",
        "userID": "6467ca2743bdde9bf9f45b97",
        "status": "up",
        "downtime": 0,
        "uptime": 0,
        "requests_count": 1,
        "outages": 0,
        "total_response_time": 2474,
        "tag": "t2",
        "history": [
            {
                "timestamp": "2023-05-23T09:28:16.619Z",
                "status": "up",
                "_id": "646c873358b5736fc63a604e"
            }
        ],
        "__v": 0
        }, 
        {}, ...
    ]
   ```

- `GET /url/tag/:tag`:
  
  Retrieves all URLs owned by the authenticated user with a specific tag, Example:

  Request:

  ```
  GET: http://localhost:7000/url/tag/t2
  ```

  `x-auth-token` is provided in the request header.

  Response:

    ```json
    "message": "Your URLs",
    "urls": [
        {
        "_id": "646c873058b5736fc63a604a",
        "link": "https://fakestoreapi.com/products/1",
        "userID": "6467ca2743bdde9bf9f45b97",
        "status": "up",
        "downtime": 0,
        "uptime": 0,
        "requests_count": 1,
        "outages": 0,
        "total_response_time": 2474,
        "tag": "t2",
        "history": [
            {
                "timestamp": "2023-05-23T09:28:16.619Z",
                "status": "up",
                "_id": "646c873358b5736fc63a604e"
            }
        ],
        "__v": 0
        }, 
        {}, ...
    ]
   ```

- `PUT: /url`:
  
  Updates the details of a specific URL owned by the authenticated user, Example:

    ```text
    PUT: http://localhost:7000/url/?link='https%3A%2F%2Ffakestoreapi.com%2Fproducts%2F1'
    ```

  Request body:

    ```json
    {
        "_id": "646c873058b5736fc63a604a",
        "link": "https://fakestoreapi.com/products/1",
        "userID": "6467ca2743bdde9bf9f45b97",
        "status": "up",
        "downtime": 0,
        "uptime": 10,
        "requests_count": 2,
        "outages": 0,
        "total_response_time": 2777,
        "tag": "t1",
        "history": [
            {
                "timestamp": "2023-05-23T09:28:16.619Z",
                "status": "up",
                "_id": "646c873358b5736fc63a604e"
            },
            {
                "timestamp": "2023-05-23T09:38:19.130Z",
                "status": "up",
                "_id": "646c898b58b5736fc63a685a"
            }
        ],
        "__v": 0
    }
    ```

    `x-auth-token` is provided in the request header.

    Response:

    ```json
    {
    "message": "URL updated successfully",
    "url": {
        "_id": "646c873058b5736fc63a604a",
        "link": "https://fakestoreapi.com/products/1",
        "userID": "6467ca2743bdde9bf9f45b97",
        "status": "up",
        "downtime": 0,
        "uptime": 20,
        "requests_count": 3,
        "outages": 0,
        "total_response_time": 3163,
        "tag": "t2",
        "history": [
            {
                "timestamp": "2023-05-23T09:28:16.619Z",
                "status": "up",
                "_id": "646c873358b5736fc63a604e"
            },
            {
                "timestamp": "2023-05-23T09:38:19.130Z",
                "status": "up",
                "_id": "646c898b58b5736fc63a685a"
            },
            {
                "timestamp": "2023-05-23T09:48:19.441Z",
                "status": "up",
                "_id": "646c8be358b5736fc63a701e"
            }
        ],
        "__v": 0
    }
    }

    ```
    the response returns the old version of the url.

- `DELETE: /url`:
  
  Deletes a specific URL owned by the authenticated user, Example:

  Request:

    ```text
    DELETE: http://localhost:7000/url/?link='https%3A%2F%2Ffakestoreapi.com%2Fproducts%2F1'
    ```

    `x-auth-token` is provided in the request header.

    Response:

    ```json
    {
    "message": "URL deleted successfully"
    }
    ```

## Docker containers

The app consists of two containers one for the app (app) and the other for the mongoDB (db).
the two services (containers) are composed using docker-compose file having the app image configuration in the Dockerfile.

- **Environment Variables**:
  
  make sure you provide the `MONGO_URI = mongodb://db:27017/bosta-assesment`
  using the db service so that the docker DNS will convert it to the service network to be accessed by app container.

- **Ports**:
  
  The app container runs on port 7000 and the db runs on 27017 make sure that the two ports are not used before running the containers.

- **Build and Run Instructions**:

  - ```docker compose build```.
  - ```docker compose up```.

## Testing

The testing uses jest and supertest libraries.
to run the tests make sure the mongod service is running and run the tests using ```npm test```.
