# 1. API `/auth`

- `POST /login`: login
  - Test with SQL injection in the username or password fields.
  - Test with excessively long username or password inputs to check for potential buffer overflow or denial of service vulnerabilities.
  - Test with special characters and encoded payloads in the username or password fields to check for potential injection vulnerabilities.
- `GET /refresh`: refresh
  - Test with a manipulated JWT refresh token to bypass token validation and gain unauthorized access.
  - Test with an invalid or malformed JWT refresh token to check if the API properly handles token parsing and validation.
- `GET /logout`: logout
  - Test with a manipulated JWT refresh token to attempt session hijacking or impersonation.

# 2. API `/users`

- `POST /`: Create new user
  - Test with special characters, encoded payloads, or excessively long inputs in user data fields to check for potential injection or buffer overflow vulnerabilities.
  - Test with duplicate or conflicting user data to check if the API properly handles unique constraints and data validation.
- `GET /`: Read user data
  - Test with a manipulated JWT access token to access another user's data or gain unauthorized privileges.
- `PATCH /`: Update user
  - Test with a manipulated JWT access token to update another user's data or gain unauthorized privileges.
  - Test with special characters, encoded payloads, or excessively long inputs in user data fields to check for potential injection or buffer overflow vulnerabilities.
- `DELETE /`: Delete user
  - Test with a manipulated JWT access token to delete another user's account or gain unauthorized privileges.

# 3. API `/notes`

- `GET /`: Read user notes
  - Test with a manipulated JWT access token to access another user's notes or gain unauthorized privileges.
- `POST /`: Create user note
  - Test with a manipulated JWT access token to create a note on behalf of another user or gain unauthorized privileges.
  - Test with special characters, encoded payloads, or excessively long inputs in note data fields to check for potential injection or buffer overflow vulnerabilities.
- `PATCH /`: Update user note
  - Test with a manipulated JWT access token to update another user's note or gain unauthorized privileges.
  - Test with special characters, encoded payloads, or excessively long inputs in note data fields to check for potential injection or buffer overflow vulnerabilities.
- `DELETE /`: Delete user note
  - Test with a manipulated JWT access token to delete another user's note or gain unauthorized privileges.

# 4. API `/admin`

## `/users`

- `GET /`: Read all users
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
- `PATCH /`: Update user by ID
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
- `DELETE /`: Delete user by ID
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.

## `/notes`

- `GET /`: Read all notes
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
- `POST /`: Create note
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
- `PATCH /`: Update note
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
- `DELETE /`: Delete note
  - Test with a manipulated JWT access token without the required Admin role to check if the API properly enforces authorization.
