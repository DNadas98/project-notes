# Express server

- https://github.com/DNadas98/express_server

# Config

- backend/config/
  - main config file: `config.env`
  - CORS whitelist: `allowedOrigins.js`

# Middleware

- [helmet](https://www.npmjs.com/package/helmet)
- [rateLimiter](https://www.npmjs.com/package/express-rate-limit)
- [cors](https://www.npmjs.com/package/cors)

- loginLimiter
- verifyJWT
- verifyUser
- verifyRoles
- (request `--> middleware -->` API endpoint)

# Routes

- --> helmet --> rateLimiter --> verifyOrigin --> cors -->

### API `/auth`

- --> loginLimiter -->
- `POST /login`: login
- --> verifyJWT --> verifyUser
- `GET /refresh`: refresh
- `GET /logout`: logout

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

- mongoDB local
- projectsdb

# Dotenv

- `backend/config/config.env`

# Frontend

### React router
