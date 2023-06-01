# Express server

- https://github.com/DNadas98/express_server

# Routes

### Root

- GET `^/$|/index(.html)?`: Home page
- GET `/old(.html)?`: Test redirect
- GET `/error`: Test 500 error

### API `/users`

- GET `/`: Read all users
- POST `/`: Create user
- PATCH `/`: Update user
- DELETE `/`: Delete user

### API `/notes`

- GET `/`: Read all notes
- POST `/`: Create note
- PATCH `/`: Update note
- DELETE `/`: Delete note

# Database

- mongoDB local
- projectsdb

# Dotenv

- `backend/config/config.env`

# Frontend

### React router

# New info

### Dotenv:

- Configure .env so the whole server can use it as process.env. ...
  ```js
  require("dotenv").config({ path: "backend/config/config.env" });
  ```

### Mongo/mongoose

#### Queries

- [`.select()`](https://devdocs.io/mongoose/api/query#query_Query-select)
  - specifies what fields the query should return
- [`.lean()`](https://devdocs.io/mongoose/api/query#query_Query-lean)
  - returns plain js object without mongoose specific features
- [`.exec()`](https://devdocs.io/mongoose/api/query#query_Query-exec)

  - executes the query, needs to be used when the return value of the query is used later on

#### Schemas

- [timestamp](https://mongoosejs.com/docs/timestamps.html)

  - adds `createdAt`, `updatedAt` properties

  ```js
  const mySchema = new mongoose.Schema({}, { timestamps: true });
  ```

- [mongoose-sequence](https://www.npmjs.com/package/mongoose-sequence)

  - used for auto incremented fields (id)

  ```js
  const autoIncrement = require("mongoose-sequence")(mongoose);
  noteSchema.plugin(autoIncrement, { inc_field: "ticket", id: "ticketNums", start_seq: 1 });
  ```

### React

- react router:
  ```js
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
  ```
