# Material

1. **Add Material**: ```POST /materials```
    - Request
      ```json
      {
        "class_id": "class_id",
        "title": "Materi AlJabar",
        "content": "Aljabar adalah ..."
      }
      ```
    - Response
      - Status Code: 201
        ```json
        {
          "material_id": "material-id",
          "message": "successfully added the material"
        }
        ```
      - Status Code: 400
        ```json
        {
          "messages": {
            "class_id": "class id is required",
            "title": "title is required",
            "content": "content is required"
          }
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "class not found"
        }
        ```

2. **Get Materials**: ```GET /materials/{class_id}/class```
    - Response
      - Status Code: 200
        ```json
        {
          "data": {
            "class_id": "class-id",
            "user_id": "user-id",
            "class_name": "class name",
            "materials": [
              {
                "id": "material-id",
                "title": "Materi AlJabar",
                "total_questions": 5,
                "created_at": "Senin, 20 Agustus 2025"
              }
            ]
          }
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "class not found"
        }
        ```
      
3. **Get Material**: ```GET /materials/{material_id}```
    - Response
      - Status Code: 200
        ```json
        {
          "data": {
            "material_id": "material-id",
            "title": "title material",
            "content": "content material",
            "questions": [
              {
                "id": "question-id",
                "question_text": "Apa itu aljabar?",
                "Answers": [
                  {
                    "id": "answer-id",
                    "question_id": "question-id",
                    "answer_text": "A. Answer Text",
                  }
                ],
              }
            ]
          }
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized",
          "is_auth": false
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "material not found"
        }
        ```

4. **Delete Material**: ```DELETE /materials/{material_id}```
    - Response
      - Status Code: 200
        ```json
        {
          "message": "successfully added the material"
        }
        ```
      - Status Code: 401
        ```json
        {
          "message": "unauthorized",
          "is_auth": false
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "material not found"
        }
        ```