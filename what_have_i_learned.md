# [Dotenv](https://www.npmjs.com/package/dotenv):

- Configure .env so the whole server can use it as process.env. ...
  ```js
  require("dotenv").config({ path: "backend/config/config.env" });
  ```
- Secret keys:
  - ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
  - `node` (terminal):
    ```js
    require("crypto").randomBytes(64).toString("hex");
    ```

# JWT

- [`sign`](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback): syncronous

- [`verify`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)
  - without callback: sync, returns decoded token
  - with callback: async

# Mongo/mongoose

### Queries

- [`.select(s)`](https://devdocs.io/mongoose/api/query#query_Query-select)
  - specifies what fields the query should return
  ```js
  const user = await User.findById(userid).select("-_id -password -active").lean();
  const usernames = await User.find().select("username").lean();
  ```
- [`.lean()`](https://devdocs.io/mongoose/api/query#query_Query-lean)
  - executes the query, returns js object(array) without mongoose specific features
  - should be used whenever possible
- [`.exec()`](https://devdocs.io/mongoose/api/query#query_Query-exec)
  - executes the query,returns mongoose document(array) with mongoose features

### Schemas

- [timestamp](https://mongoosejs.com/docs/timestamps.html)

  - adds `createdAt`, `updatedAt` properties

  ```js
  const mySchema = new mongoose.Schema({}, { timestamps: true });
  ```

# React

- react router:
  ```js
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
  ```
