# My express server

- https://github.com/DNadas98/express_server

# Config

- backend/config/
  - main config file: `config.env`
  - banned list: `bannedOrigins.js`
  - CORS allowed list: `corsAllowedOrigins.js`

# Middleware

- [helmet](https://www.npmjs.com/package/helmet)
- rateLimiter: [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
  - config.env: LIMITER_MS, LIMITER_MAX
  - max 200 requests in 10 min by IP
- banned: middleware that blocks banned origins
  - banned list: config/bannedOrigins.js
  - possible results:
    - response: 403, json or text message: Forbidden
    - calls `next()`
- [cors](https://www.npmjs.com/package/cors)

  - allowed list: config/corsAllowedOrigins.js

- loginLimiter:
  - same npm package as rateLimiter
  - max 5 login requests in 1 min by IP
- verifyJWT: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - https://auth0.com/docs/secure/tokens/json-web-tokens
  - verifies, decodes JWT access token
  - requires:
    - JWT access token in Authorization header
  - possible results:
    - response: 401, json message: Unauthorized
    - decoded --> `req.userid, req.roles`, calls `next()`
- verifyUser:
  - verifies that the user data decoded from the JWT access token exists in the database
  - requires:
    - req.userid, req.roles
  - possible results:
    - response: 401, json message: Unauthorized
    - calls `next()`
- verifyRoles:
  - verifies that the user data decoded from the JWT access token has one of the roles that are allowed to access the endpoint
  - example:
  ```js
  router.use((req, res, next) => verifyRoles(req, res, next, ["Editor", "Admin"]));
  /*endpoints only accessible to users with Editor, and/or Admin roles*/
  ```
  - requires:
    - req.roles
  - possible results:
    - response: 401, json message: Unauthorized
    - calls `next()`

# Routes

- (request `--> middleware -->` API endpoint: controller function)
- --> helmet --> rateLimiter --> banned --> cors -->

### API `/auth`

- `POST /login`: login
  - --> loginLimiter -->
  - requires:
    - username: string, password: string in request body
  - possible results:
    - response: 4xx, json error message
    - response: 200, body: new JWT access token, cookie: new JWT refresh token
- `GET /refresh`: refresh
  - --> verifyJWT --> verifyUser -->
  - requires:
    - cookie: JWT refresh token
  - possible results:
    - response: 4xx, json error message
    - response: 200, body: new JWT access token
- `POST /logout`: logout
  - requires:
    - cookie: JWT refresh token
  - possible results:
    - response: 204, json message: No content
    - response: 200, body: new JWT access token

### API `/users`

- `POST /`: Create new user
- --> verifyJWT --> verifyUser -->
- `GET /`: Read user data
- `PATCH /`: Update user
- `DELETE /`: Delete user

### API `/notes`

- --> verifyJWT --> verifyUser -->
- `GET /`: Read user notes
- `POST /`: Create user note
- `PATCH /`: Update user note
- `DELETE /`: Delete user note

### API `/admin`

- --> verifyJWT --> verifyUser --> verifyRoles[ "Admin" ] -->

  #### `/users`

  - `GET /`: Read all users
  - `PATCH /`: Update user by ID
  - `DELETE /`: Delete user by ID

  #### `/notes`

  - `GET /`: Read all notes
  - `POST /`: Create note
  - `PATCH /`: Update note
  - `DELETE /`: Delete note

# Database

- mongoDB localhost
- config/config.env/DB_CONN_STR
- projectsdb
  - users
  - notes

# Frontend: React

### Config

- frontend/.env

### React routing

- react-router-dom 6
- App.js

### [JWT Strategy](https://youtu.be/nI8PYZNFtac?list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&t=106)

- Goal: reduce risk of [XSS](https://owasp.org/www-community/attacks/xss/), [CSRF](https://owasp.org/www-community/attacks/csrf)
- access token
  - sent in response body, stored in React context
  - fetch: Authorization header
- refresh token
  - sent and stored in cookie (HTTP only, sameSite, secure)
  - can not issue new refresh token
- if at any point there is a 401 or 403 status code:
  - try to refresh, update auth context, send request again
  - failed:
    - clear jwt cookie
    - redirect to /login

### Style

- Flex layout
