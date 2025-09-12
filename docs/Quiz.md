# Quiz

*note: This is endpoints for do the quiz

1. **Submit Answers**: ```POST /quiz/{material_id}```
    - Request
      ```json
      {
        "answers": [
          {
            "question_id": "question-id", 
            "answer": "A"
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
                "answer": "A",
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

2. **Review Result**: ```GET /quiz/results/{class_id}```
    - Response
      ```json
      {
        "data": {
          "quiz_results": [
            {
              "id": "quiz_result-id",
              "title_material": "Materi Aljabar",
              "score": 80,
              "completed_at": "2025-09-10T12:00:00Z"
            }
          ]
        }
      }
      ```
