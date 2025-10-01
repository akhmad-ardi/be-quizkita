# Quiz

*note: This is endpoints for do the quiz

1. **Submit Answers**: ```POST /quiz/{material_id}```
    - Request
      ```json
      {
        "answers": [
          {
            "question_id": "question-id", 
            "answer_id": "answer-id"
          }
        ]
      }
      ```
    - Response
      - Status Code: 201
        ```json
        {
          "data": {
            "score": 80,
            "feedback": [
              {
                "question_id": "question-id", 
                "question_text": "Apa itu Alajabar?",
                "user_answer": "A",
                "correct": true,
                "correct_answer": "A",
                "explanation": "Aljabar adalah ..."
              },
            ]
          }
        }
        ```
      - Status Code: 400
        ```json
        {
          "message": "answer all questions"
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "quiz not found"
        }
        ```

2. **Get User Quiz Result**: ```GET /quiz/{material_id}```
    - Response
      - Status Code: 200
        ```json
        {
          "data": {
              "id": "user-quiz-result-id",
              "material_id": "material-id",
              "score": 100,
              "user_id": "user-id",
              "completed_at": "date",
          }
        }
        ```
      - Status Code: 404
        ```json
        {
          "message": "user quiz result not found"
        }
        ```