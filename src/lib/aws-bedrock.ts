// This example demonstrates how to use the Amazon Nova foundation models to generate text.
// It shows how to:
// - Set up the Amazon Bedrock runtime client
// - Create a message
// - Configure and send a request
// - Process the response

import {
  BedrockRuntimeClient,
  ConversationRole,
  ConverseStreamCommand,
  Message,
  ConverseStreamCommandInput,
  ModelErrorException,
  ModelTimeoutException,
  ModelStreamErrorException,
} from '@aws-sdk/client-bedrock-runtime';

// Step 1: Create the Amazon Bedrock runtime client
// Credentials will be automatically loaded from the environment.
const client = new BedrockRuntimeClient({ region: 'ap-southeast-1' });

// Step 2: Specify which model to use:
// Available Amazon Nova models and their characteristics:
// - Amazon Nova Micro: Text-only model optimized for lowest latency and cost
// - Amazon Nova Lite:  Fast, low-cost multimodal model for image, video, and text
// - Amazon Nova Pro:   Advanced multimodal model balancing accuracy, speed, and cost
//
// For the most current model IDs, see:
// https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
const modelId = process.env.MODEL_ID;

export async function GenerateQuestions({ content }: { content: string }) {
  // Step 3: Create the message
  // The message includes the text prompt and specifies that it comes from the user
  const inputText = `
  Anda adalah asisten AI untuk platform edukasi bernama QuizKita. 
  Tugas Anda adalah menghasilkan soal pilihan ganda (MCQ) berdasarkan materi yang diberikan pengguna. 

  Aturan:
  1. Buat 5 soal pilihan ganda.
  2. Setiap soal harus memiliki field:
    - "question": string
    - "options": array of 4 strings ["A. ...", "B. ...", "C. ...", "D. ..."]
    - "answer": string (misalnya "B")
    - "explanation": string
  3. Output WAJIB berupa JSON valid berbentuk array dari object-object soal.
  4. Output HANYA JSON valid. Jangan keluarkan teks lain di luar JSON, termasuk penjelasan atau catatan.
  5. Jangan tambahkan komentar atau format lain di luar struktur JSON yang ditentukan.

  materi:
  ${content}
  `;
  const message: Message = {
    content: [{ text: inputText }],
    role: ConversationRole.USER,
  };

  // Step 4: Configure the request
  // Optional parameters to control the model's response:
  // - maxTokens: maximum number of tokens to generate
  // - temperature: randomness (max: 1.0, default: 0.7)
  //   OR
  // - topP: diversity of word choice (max: 1.0, default: 0.9)
  // Note: Use either temperature OR topP, but not both
  const request: ConverseStreamCommandInput = {
    modelId,
    messages: [message],
    inferenceConfig: {
      maxTokens: 1024, // The maximum response length
      temperature: 0.7, // Using temperature for randomness control
      topP: 0.9, // Alternative: use topP instead of temperature
    },
  };

  // Step 5: Send and process the request
  // - Send the request to the model
  // - Extract and return the generated text from the response
  try {
    const response = await client.send(new ConverseStreamCommand(request));
    console.log('Response Gen AI: ', response.stream);

    let generatedText = '';

    // Gabungkan hasil streaming token menjadi string utuh
    for await (const event of response.stream) {
      if (event.contentBlockDelta?.delta?.text) {
        generatedText += event.contentBlockDelta.delta.text;
      }
    }

    // Coba parse ke JSON valid
    let quizData: Array<{
      question: string;
      options: Array<string>;
      answer: string;
      explanation: string;
    }>;
    try {
      quizData = JSON.parse(generatedText);
      // console.log('Quiz Data', quizData);
      return quizData;
    } catch (err) {
      throw { statusCode: 500, message: "Model doesn't return valid JSON" };
    }
  } catch (error) {
    console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${error.message}`);

    if (error instanceof ModelErrorException) {
      console.error(`ERROR: Model Error Exception ${error.originalStatusCode}`);
    }

    if (error instanceof ModelTimeoutException) {
      console.error(`ERROR: Model Timeout Exception. Reason: ${error.message}`);
    }

    if (error instanceof ModelStreamErrorException) {
      console.error(`ERROR: Model Timeout Exception ${error.originalStatusCode}`);
    }

    throw { statusCode: 500, message: error.message };
  }
}
