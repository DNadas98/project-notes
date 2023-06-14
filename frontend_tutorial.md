# React routing

- index.js:

  - errorhandler
    - browserroter
      - authprovider
        - routes
          - route: App

- App.js:

  - routes
    - route: Layout
      - route
      - route
      - ...public
      - require auth `allowedRoles={["User"]}`
        - route
        - route
        - ...
      - require auth `allowedRoles={["Editor","Admin"]}`
        - route
        - route
        - ...
      - require auth `allowedRoles={["Admin"]}`
        - route
        - route
        - ...
      - ....protected
    - 404

- Layout.js:
  - main
    - Outlet

# Auth

### hooks/useAuth

- `return useContext(AuthContext)`

### [context/AuthContext](https://youtu.be/X3qyxo_UTR4?list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&t=840)

- AuthProvider.js

### [components/RequireAuth](https://youtu.be/oUZjO00NkhY?list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&t=682)

- `import useAuth`
- `return checks ? Outlet : navigate to login`
  - `find role in allowedroles?`
  - `auth?.user?`
  - navigate state from: replace path in history
