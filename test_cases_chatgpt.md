# 1. API `/auth`

- `POST /login`: login
  - Test with valid username and password in the request body.
  - Test with invalid username and password combinations.
  - Verify that the response contains a new JWT access token and a JWT refresh token in the response body and cookies.
- `GET /refresh`: refresh
  - Test with a valid JWT refresh token in the cookie.
  - Test with an invalid or expired JWT refresh token.
  - Verify that the response contains a new JWT access token.
- `GET /logout`: logout
  - Test with a valid JWT refresh token in the cookie.
  - Test with an invalid or expired JWT refresh token.
  - Verify that the response returns a successful status code and appropriate message.

# 2. API `/users`

- `POST /`: Create new user
  - Test with valid user data in the request body.
  - Test with invalid or missing user data.
  - Verify that the response returns a successful status code and the newly created user data.
- `GET /`: Read user data
  - Test with a valid JWT access token in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns the user data for the authenticated user.
- `PATCH /`: Update user
  - Test with a valid JWT access token and updated user data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the updated user data.
- `DELETE /`: Delete user
  - Test with a valid JWT access token in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and appropriate message.

# 3. API `/notes`

- `GET /`: Read user notes
  - Test with a valid JWT access token in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns the user's notes.
- `POST /`: Create user note
  - Test with a valid JWT access token and note data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the newly created note.
- `PATCH /`: Update user note
  - Test with a valid JWT access token, note ID, and updated note data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the updated note data.
- `DELETE /`: Delete user note
  - Test with a valid JWT access token and note ID in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and appropriate message.

# 4. API `/admin`

## `/users`

- `GET /`: Read all users
  - Test with a valid JWT access token and the required Admin role in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns all user data.
- `PATCH /`: Update user by ID
  - Test with a valid JWT access token, the required Admin role, and user data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the updated user data.
- `DELETE /`: Delete user by ID
  - Test with a valid JWT access token and the required Admin role in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and appropriate message.

## `/notes`

- `GET /`: Read all notes
  - Test with a valid JWT access token and the required Admin role in the Authorization header.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns all notes data.
- `POST /`: Create note
  - Test with a valid JWT access token, the required Admin role, and note data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the newly created note.
- `PATCH /`: Update note
  - Test with a valid JWT access token, the required Admin role, note ID, and updated note data in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and the updated note data.
- `DELETE /`: Delete note
  - Test with a valid JWT access token and the required Admin role, and note ID in the request body.
  - Test without a JWT access token or with an invalid token.
  - Verify that the response returns a successful status code and appropriate message.
