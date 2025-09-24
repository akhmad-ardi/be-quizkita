# Class

1. **Add Class**: ```POST /classes```
    - Request
      ```json
      {
        "name": "Kelas Matematika Dasar"
      }
      ```
    - Response
      - Status Code: 201
        ```json
        {
          "class_id": "ABC123",
          "message": "successfully added the class"
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "name": "name is required"
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized"
        }
        ```

2. **Join Class**: ```POST /classes/join```
    - Request
      ```json
      {
        "invite_code": "ABC123"
      }
      ```
    - Response
      - Status Code: 200
        ```json
        {
          "message": "successfully joined the class"
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "invite_code": "invite code is required"
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized"
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "class not found"
        }
        ```
      - Status Code: 409
        ```json
        {
          "message": "user already exist in class"
        }
        ```

3. **Add User to Class**: ```POST /classes/{class_id}/user```
    - Request
      ```json
      {
        "username": "ardi123"
      }
      ```
    - Response
      - Status Code: 200
        ```json
        {
          "message": "successfully add user to class"
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "username": "username is required"
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized"
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "username not found"
        }
        ```
        or:
        ```json
        {
          "message": "class not found"
        }
        ```

4. **List User's Class**: ```GET /classes```
    - Response:
      - Status Code: 200
        ```json
        {
          "data": {
            "classes": [
              {
                "id": "class-uuid",
                "name": "Kelas Matematika Dasar",
                "total_quiz": 4,
                "created_at": "2025-09-13T02:56:25.464Z"
              }
            ]
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized"
        }
        ```

4. **Delete Class**: ```DELETE /classes/{class_id}```
    - Response:
      - Status Code: 200
        ```json
        {
          "message": "successfully delete class"
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "class not found"
        }
        ```
  
