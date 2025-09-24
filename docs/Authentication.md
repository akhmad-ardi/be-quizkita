# Authentication

1. **Sign Up**: ```POST /auth/sign-up```
    - Request
    ```json 
    {
      "username": "ardi123",
      "fullname": "Akhmad Ardiansyah",
      "password": "securePass123",
      "confirm_password": "securePass123"
    }
    ```
    - Response
      - Status Code: 201
        ```json
        {
          "message": "successfully sign up"
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "username":"username is required"
          }
        }
        ```
      - Status Code: 409
        ```json
        {
          "message": "username already exist"
        }
        ```

2. **Sign In**: ```POST /auth/sign-in```
    - Request
      ```json
      {
        "username": "ardi123",
        "password": "securePass123"
      }
      ```
    - Response
      - Status Code: 200
        ```json
        {
          "data": {
            "token": "jwt-token"
          }
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "username":"username is required"
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "invalid username or password"
        }
        ```
3. **Validate Tokenn**: ```POST /auth/validate-token```
    - Response
      - Status Code: 200
        ```json
        {
          "is_auth": true
        }
        ```
      - Status Code: 400
        ```json
        {
          "message": "token verification failed",
          "is_auth": false
        }
        ```

      - Status Code: 401
        ```json
        {
          "message": "token expired" | "token not active yet",
          "is_auth": false
        }
        ```
      
      - Status Code: 403
        ```json
        {
          "message": "invalid token signature" | "invalid token claims",
          "is_auth": false
        }
        ```