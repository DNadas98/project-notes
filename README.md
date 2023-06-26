# Install & run

- backend:
  - in root folder: npm i, npm run dev
  - (yes, the "secrets" are included in config.env, only for testing)
- frontend:
  - create .env, write PORT=3502 into it
  - in root/frontend: npm i, npm start

# To Do
- implement transactions to make the most critical interactions atomic at the DB level
- refactor frontend:
  - single responsibility principle (the fetch hooks for example)
  - react controlled / uncontrolled form format, names and other properties of elements
  - make tables tables instead of lists with weird css
- add some meaningful content to the frontend

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
  - verifies, decodes JWT tokens, compares their data
  - requires:
    - JWT access token in Authorization header
  - possible results:
    - response: 401, json message: Unauthorized
    - decoded --> `req.userid, req.roles, req.refreshToken`, calls `next()`
- verifyUser:
  - verifies that the user data decoded from the JWT tokens exists in the database
  - requires:
    - req.userid, req.roles, req.refreshToken
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
- `GET /validate`: validate the user
  - --> verifyJWT --> verifyUser -->
  - requires:
    - JWT access token
    - cookie: JWT refresh token
  - possible results
    - response: 401, json Unauthorized message
    - response: 200, json OK message
- `GET /validate/admin`
  - same + --> verifyRoles ["Admin"] -->

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
    - can not modify another admin
  - `DELETE /`: Delete user by ID
    - can not delete another admin

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
- [reminder to check out transactions in mongoose](https://mongoosejs.com/docs/transactions.html#with-mongoose-documents-and-save)

# Token Strategy

- Goal: reduce risk of [XSS](https://owasp.org/www-community/attacks/xss/), [CSRF](https://owasp.org/www-community/attacks/csrf)
- access token
  - sent in response body, stored only in memory (React context)
  - fetch: Authorization header
- refresh token
  - sent in cookie (HTTP only, sameSite, secure)
  - also stored as hashed string in the DB
    - User: `refreshTokens[]`
    - removed at logout or if an old cookie is still present at new login
  - can not issue new refresh token
- if at any point an already invalidated (removed from the db) refresh token is sent:
  - clear all refresh tokens for the user from the db (logout on all devices)
  - clear cookie
  - response: 401, json message: Unauthorized
- if for any fetch the response is `401` or `403`:
  - `refresh`
    - success: update auth context, retry request
    - failed or retried request is failed or error: `logout`
  - `only fetch from the API using the custom hook at the frontend`

# Frontend: React

### Config

- frontend/.env
  - `PORT=3502`
  - required for testing (see `corsOptions.js`, `allowedOrigins.js` of backend express server)
  - if this doesn't exist, create it

### React routing

- react-router-dom 6
- App.jsx
  - public routes: `"/"`
    - `"/": Home`
    - `"/login": Login`
    - `"/register": Register`
  - user routes: `"/user"`
    - `"/": UserHome`
    - `"/notes": UserNotesList`
    - `"/notes/create": CreateNote`
    - `"/notes/edit": EditNote`
    - `"/settings": UserDetails`
  - admin routes: `"/admin"`
    - `"/": AdminHome`
    - `"/users": UsersList`
    - `"/users/edit": EditUser`
    - `"/users/notes": AdminNotesList`
    - `"/notes/all": AdminNotesList`
  - error handling
    - `"/err": Error`
      - test error
    - `"*": NotFound`
      - 404
    - `ErrorBoundary`
      - 500
      - wraps all routes

### Authentication, authorization

- `context/auth/AuthProvider.js`
  - global auth state: username:String, roles:String[], accessToken:String
- `hooks/auth/useAuth.js`
  - custom hook to simplify access to auth context
  - `const {auth,setAuth}=useAuth();`
- `components/auth/requireAuth.jsx`
  - verifies, that the user has the required auth context with the correct roles
  - doesn't validate the information, that only happens on the server side
    - this is why 'empty' `/validate` and `validate/admin` endpoints are needed
- `hooks/useApiFetch`
  - custom fetch hook, `required for all API fetches`
  - has the current API url
  - handles token strategy mentioned above consistently
  - usage:
  ```js
  import ...
  const apiFetch=useApiFetch();
  // ...
  const {httpResponse,responseObject} = await apiFetch()
  ```

### Custom 'utility' components

- auth/Unauthorized
- BackButton
  - `navigate(-1)`
- ConfirmBackButton
  - same with confirm message
- Confirm:
  - Are you sure ... | Confirm | Cancel |
  - required states:
    - `confirmText`: String
    - `showConfirm`: boolean
    - `setShowConfirm`: setter
    - `onConfirm`: the original function
    - `setOnConfirm`: setter
  - set these where the function would be called
- LoadingSpinner:
  - [react-spinners](https://www.npmjs.com/package/react-spinners)
  - useful for API fetches or any outside data source

### Style

- `style/App.css`
- css variables for colors, transition speed
- Flex layout
- confirm: absolute positioned 'popup'
- tables (could be improved)
