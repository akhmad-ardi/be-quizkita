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
          "token": "jwt-token"
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