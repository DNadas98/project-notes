# Express server

## Routes

- GET `/`: Index page
- GET `/error`: Example 500 error as test

## Default port

- The default port is 3001 see server.js

## Security measures

- [helmet](https://helmetjs.github.io/)
  - Collection of security middlewares that modify the request header
  - Content-Security-Policy:self by default
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
  - Limits allowed requests for each IP per a given time frame
  - `backend/config/rateLimiter.js`

## CORS
- `backend/config/allowedOrigins`
- [Config documentation](https://expressjs.com/en/resources/middleware/cors.html#configuring-cors)
- !origin option is unsafe! See config/corsOptions
  - This is only for developement (localhost: undefined origin)

## Logger middleware

- middleware/logger.js
- Requests: logs/reqLog.txt
- Served data: logs/servedLog.txt
- Server side errors: logs/errLog.txt

## Frontend references

- HTML files: path relative to root/frontend/views
- Other static files: path relative to root/frontend/public
