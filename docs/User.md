# Authentication

1. **Get User Auth**: ```GET /users/auth```
    - Response
      - Status Code: 200
        ```json
        {
          "data": {
            "id": "user-id",
            "username": "username",
            "fullname": "user fullname",
          }
        }
        ```